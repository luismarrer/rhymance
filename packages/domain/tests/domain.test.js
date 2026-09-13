const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateAge,
  formatPoemExcerpt,
  createMatchId,
  evaluateMutualSwipe,
  createMockRepositories,
  DEMO_USER,
  InMemoryPoemRepository,
  InMemoryMatchRepository,
  InMemoryConversationRepository,
} = require('../dist/index.js');

test('Domain: calculateAge accurately computes age from YYYY-MM-DD', () => {
  const refDate = new Date('2026-04-15T00:00:00Z');

  // Birthday hasn't happened yet in the year
  assert.equal(calculateAge('2000-06-20', refDate), 25);

  // Birthday already happened in the year
  assert.equal(calculateAge('2000-01-10', refDate), 26);

  // Invalid or empty string returns 0 safely
  assert.equal(calculateAge(''), 0);
  assert.equal(calculateAge('invalid-date'), 0);
});

test('Domain: formatPoemExcerpt preserves short poems and truncates long poems', () => {
  const shortPoem = 'Línea uno\nLínea dos';
  assert.equal(formatPoemExcerpt(shortPoem, 3), shortPoem);

  const longPoem = 'Verso 1\nVerso 2\nVerso 3\nVerso 4\nVerso 5';
  const excerpt = formatPoemExcerpt(longPoem, 2);
  assert.equal(excerpt, 'Verso 1\nVerso 2\n...');
});

test('Domain: createMatchId generates deterministic alphabetically sorted ID', () => {
  assert.equal(createMatchId('user_b', 'user_a'), 'user_a_user_b');
  assert.equal(createMatchId('user_a', 'user_b'), 'user_a_user_b');
  assert.equal(createMatchId('poet_alex', 'poet_limary'), 'poet_alex_poet_limary');
});

test('Domain: evaluateMutualSwipe triggers match only on reciprocal likes', () => {
  const poemId = 'poem_123';
  const swiperId = 'user_1';
  const targetId = 'user_2';

  // No previous like from target -> no match
  const swipeA = { swiperId, targetId, type: 'like', createdAt: new Date().toISOString() };
  const res1 = evaluateMutualSwipe(swipeA, [], poemId);
  assert.equal(res1.isMatch, false);

  // Pass swipe -> never match
  const passSwipe = { swiperId, targetId, type: 'pass', createdAt: new Date().toISOString() };
  const resPass = evaluateMutualSwipe(passSwipe, [{ swiperId: targetId, targetId: swiperId, type: 'like', createdAt: '' }], poemId);
  assert.equal(resPass.isMatch, false);

  // Target already liked swiper -> match!
  const targetLike = { swiperId: targetId, targetId: swiperId, type: 'like', createdAt: new Date().toISOString() };
  const res2 = evaluateMutualSwipe(swipeA, [targetLike], poemId);
  assert.equal(res2.isMatch, true);
  assert.ok(res2.match);
  assert.equal(res2.match.id, 'user_1_user_2');
  assert.equal(res2.match.poemId, poemId);
});

test('Domain: InMemoryPoemRepository filters out current user and supports filters', async () => {
  const repo = new InMemoryPoemRepository();

  const cards = await repo.getDiscoveryQueue('poet_alex');
  // Alex should not see his own card
  const alexCard = cards.find(c => c.author.id === 'poet_alex');
  assert.equal(alexCard, undefined);
  assert.ok(cards.length > 0);

  // Age filtering
  const matureCards = await repo.getDiscoveryQueue('user_x', { language: 'es', minAge: 26 });
  for (const card of matureCards) {
    assert.ok(card.author.age >= 26);
  }
});

test('Domain: InMemoryConversationRepository tracks messages and unread counts', async () => {
  const repo = new InMemoryConversationRepository();
  const matchId = 'match_alpha_beta';

  repo.ensureConversation(matchId, ['user_alpha', 'user_beta']);

  const msg1 = await repo.sendMessage(matchId, 'user_alpha', 'Hola poeta!');
  assert.equal(msg1.text, 'Hola poeta!');

  const msgs = await repo.getMessages(matchId);
  assert.equal(msgs.length, 1);
  assert.equal(msgs[0].text, 'Hola poeta!');

  const conv = await repo.getConversationById(matchId);
  assert.ok(conv);
  assert.equal(conv.unreadCount['user_beta'], 1);

  await repo.markConversationAsRead(matchId, 'user_beta');
  const readConv = await repo.getConversationById(matchId);
  assert.equal(readConv.unreadCount['user_beta'], 0);
});

test('Domain: createMockRepositories initializes complete demo sandbox', async () => {
  const repos = createMockRepositories();

  // Auth user is demo user
  const user = repos.authRepository.getCurrentUser();
  assert.equal(user.id, DEMO_USER.id);

  // Pre-seeded matches exist (Elena)
  const matches = await repos.matchRepository.getMatches(DEMO_USER.id);
  assert.ok(matches.some(m => m.users.includes('poet_elena')));

  // Pre-configured reciprocal like triggers instant match on swipe
  const swipeResult = await repos.matchRepository.recordSwipe({
    swiperId: DEMO_USER.id,
    targetId: 'poet_limary',
    type: 'like',
    createdAt: new Date().toISOString(),
  });
  assert.equal(swipeResult.isMatch, true);
  assert.ok(swipeResult.match);
});
