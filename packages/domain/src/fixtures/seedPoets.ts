import { DiscoveryCard, Poem, Profile, User } from '../models';
import { calculateAge } from '../services/ProfileUtils';

export interface SeedPoet {
  user: User;
  profile: Profile;
  poem: Poem;
}

export const SEED_POETS: SeedPoet[] = [
  {
    user: {
      id: 'poet_alex',
      email: 'alex@rhymance.app',
      createdAt: '2026-01-10T10:00:00Z',
      onboardingCompleted: true,
      role: 'user',
      status: 'active',
    },
    profile: {
      userId: 'poet_alex',
      firstName: 'Álex',
      dob: '2003-04-12',
      genderIdentity: 'Masculino',
      datingPreferences: ['Femenino', 'No binario'],
      location: {
        city: 'Madrid',
        country: 'España',
      },
      biography: 'Poeta nocturno y amante de las metáforas. Creo que las palabras tienen el poder de conectar almas. Buscando a alguien que entienda el lenguaje del corazón.',
      interests: ['Poesía romántica', 'Literatura', 'Música indie', 'Café de especialidad'],
      poeticStyles: ['Verso libre', 'Surrealismo', 'Romanticismo contemporáneo'],
      favoriteWriters: ['Federico García Lorca', 'Mario Benedetti', 'Alejandra Pizarnik'],
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
          moderationStatus: 'approved',
        },
      ],
      primaryPoemId: 'poem_alex_1',
      notificationPreferences: {
        push: true,
        email: false,
      },
      updatedAt: '2026-04-01T12:00:00Z',
    },
    poem: {
      id: 'poem_alex_1',
      authorId: 'poet_alex',
      title: 'Me hablaste',
      body: `Me hablaste al oído con versos de sal,
dejando en el aire la duda y el fuego.
Si el tiempo es olvido, no sé navegar
lejos del puerto que abriga tu ruego.

Quizá la noche nos guarde un rincón,
donde la tinta no sepa mentir,
y al fin encontremos la misma canción
que nunca pudimos del todo escribir.`,
      language: 'es',
      style: 'Verso libre',
      moderationStatus: 'approved',
      originalityConfirmed: true,
      context: 'Escrito en el tren de medianoche tras una conversación inolvidable.',
      createdAt: '2026-03-15T23:30:00Z',
    },
  },
  {
    user: {
      id: 'poet_limary',
      email: 'limary@rhymance.app',
      createdAt: '2026-01-12T14:00:00Z',
      onboardingCompleted: true,
      role: 'user',
      status: 'active',
    },
    profile: {
      userId: 'poet_limary',
      firstName: 'Limary',
      dob: '1999-08-19',
      genderIdentity: 'Femenino',
      datingPreferences: ['Masculino', 'No binario'],
      location: {
        city: 'Barcelona',
        country: 'España',
      },
      biography: 'Escritora de emociones y coleccionista de atardeceres. Mis versos nacen del silencio y buscan encontrar un eco en otro corazón sensible.',
      interests: ['Poesía contemporánea', 'Arte plástico', 'Naturaleza', 'Fotografía análoga'],
      poeticStyles: ['Micropoesía', 'Haikus', 'Lírica hispanoamericana'],
      favoriteWriters: ['Octavio Paz', 'Gabriela Mistral', 'Idea Vilariño'],
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
          moderationStatus: 'approved',
        },
      ],
      primaryPoemId: 'poem_limary_1',
      notificationPreferences: {
        push: true,
        email: true,
      },
      updatedAt: '2026-04-02T16:00:00Z',
    },
    poem: {
      id: 'poem_limary_1',
      authorId: 'poet_limary',
      title: 'No escribí',
      body: `No escribí para que me leyeras,
sino para saber que aún existo.
En el margen de todas tus aceras
dejé un latido jamás previsto.

Las hojas caen sin pedir perdón,
como las cartas que nunca envié.
Dime si sientes la misma estación
que en cada verso te recordé.`,
      language: 'es',
      style: 'Micropoesía',
      moderationStatus: 'approved',
      originalityConfirmed: true,
      context: 'Nacido en una tarde lluviosa frente al mar de Barcelona.',
      createdAt: '2026-03-20T18:45:00Z',
    },
  },
  {
    user: {
      id: 'poet_sofia',
      email: 'sofia@rhymance.app',
      createdAt: '2026-02-01T09:30:00Z',
      onboardingCompleted: true,
      role: 'user',
      status: 'active',
    },
    profile: {
      userId: 'poet_sofia',
      firstName: 'Sofía',
      dob: '2001-11-05',
      genderIdentity: 'Femenino',
      datingPreferences: ['Masculino'],
      location: {
        city: 'Sevilla',
        country: 'España',
      },
      biography: 'Crecí entre naranjos y sonetos. Busco a alguien que rime con mis silencios y no le tema a la intensidad poética.',
      interests: ['Flamenco', 'García Lorca', 'Té chai', 'Librerías antiguas'],
      poeticStyles: ['Sonetos modernos', 'Neopopularismo', 'Poesía sensorial'],
      favoriteWriters: ['Antonio Machado', 'Gustavo Adolfo Bécquer', 'Gioconda Belli'],
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
          moderationStatus: 'approved',
        },
      ],
      primaryPoemId: 'poem_sofia_1',
      notificationPreferences: {
        push: true,
        email: false,
      },
      updatedAt: '2026-04-03T11:00:00Z',
    },
    poem: {
      id: 'poem_sofia_1',
      authorId: 'poet_sofia',
      title: 'El susurro del Guadalquivir',
      body: `Bajo el puente de calma y azahares,
vi cruzar una sombra que cantaba.
Eran versos de amores y cantares
que la noche en su pecho cobijaba.

Si me miras despacio al pasar,
quizás veas el brillo en la arena:
no hace falta saber navegar
para amarnos al son de esta pena.`,
      language: 'es',
      style: 'Sonetos modernos',
      moderationStatus: 'approved',
      originalityConfirmed: true,
      context: 'Inspirado en los paseos nocturnos por Triana.',
      createdAt: '2026-03-22T21:10:00Z',
    },
  },
  {
    user: {
      id: 'poet_mateo',
      email: 'mateo@rhymance.app',
      createdAt: '2026-02-14T08:00:00Z',
      onboardingCompleted: true,
      role: 'user',
      status: 'active',
    },
    profile: {
      userId: 'poet_mateo',
      firstName: 'Mateo',
      dob: '1998-02-14',
      genderIdentity: 'Masculino',
      datingPreferences: ['Femenino'],
      location: {
        city: 'Buenos Aires',
        country: 'Argentina',
      },
      biography: 'Arquitecto de día, letrista cuando cae el sol. Colecciono vinilos gastados y primeras ediciones con dedicatorias misteriosas.',
      interests: ['Tango', 'Julio Cortázar', 'Arquitectura urbana', 'Cine clásico'],
      poeticStyles: ['Prosa poética', 'Lírica urbana', 'Elegías contemporáneas'],
      favoriteWriters: ['Jorge Luis Borges', 'Julio Cortázar', 'Oliverio Girondo'],
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
          moderationStatus: 'approved',
        },
      ],
      primaryPoemId: 'poem_mateo_1',
      notificationPreferences: {
        push: true,
        email: false,
      },
      updatedAt: '2026-04-04T10:00:00Z',
    },
    poem: {
      id: 'poem_mateo_1',
      authorId: 'poet_mateo',
      title: 'Café en San Telmo',
      body: `Una taza vacía, un papel arrugado,
dos esquinas que doblan hacia el mismo adiós.
Si el tango supiera que te he recordado,
cambiaría su acorde por tu dulce voz.

En la mesa contigua discuten ausencias;
yo prefiero esperarte en la última estrofa,
donde no importan tiempos ni largas distancias.`,
      language: 'es',
      style: 'Lírica urbana',
      moderationStatus: 'approved',
      originalityConfirmed: true,
      context: 'Compuesto en el histórico Bar Británico.',
      createdAt: '2026-03-25T17:00:00Z',
    },
  },
  {
    user: {
      id: 'poet_elena',
      email: 'elena@rhymance.app',
      createdAt: '2026-02-20T12:00:00Z',
      onboardingCompleted: true,
      role: 'user',
      status: 'active',
    },
    profile: {
      userId: 'poet_elena',
      firstName: 'Elena',
      dob: '2002-06-20',
      genderIdentity: 'Femenino',
      datingPreferences: ['Masculino', 'Femenino'],
      location: {
        city: 'Granada',
        country: 'España',
      },
      biography: 'Filóloga y soñadora empedernida. Creo en los amores que se leen despacio, como una buena estrofa subrayada con lápiz.',
      interests: ['Filosofía', 'Senderismo', 'Poesía mística', 'Pintura al óleo'],
      poeticStyles: ['Métrica clásica', 'Simbolismo', 'Poesía intimista'],
      favoriteWriters: ['San Juan de la Cruz', 'Rosalía de Castro', 'Walt Whitman'],
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
          moderationStatus: 'approved',
        },
      ],
      primaryPoemId: 'poem_elena_1',
      notificationPreferences: {
        push: true,
        email: true,
      },
      updatedAt: '2026-04-05T09:00:00Z',
    },
    poem: {
      id: 'poem_elena_1',
      authorId: 'poet_elena',
      title: 'Alba y ceniza',
      body: `No busco la luz que deslumbra las cumbres,
sino la chispa que queda en la hoguera.
Hay una belleza que nunca acostumbres:
la de amar sin pedir primavera.

Caminar a tu lado en la niebla que calla,
ser refugio y tormenta a la vez.
Quien se entrega al poema jamás pierde batalla,
aunque tenga que arder otra vez.`,
      language: 'es',
      style: 'Poesía intimista',
      moderationStatus: 'approved',
      originalityConfirmed: true,
      context: 'Mirando el amanecer sobre la Alhambra nevada.',
      createdAt: '2026-03-28T07:15:00Z',
    },
  },
];

export function getSeedDiscoveryCards(): DiscoveryCard[] {
  return SEED_POETS.map(poet => ({
    poem: poet.poem,
    author: {
      id: poet.user.id,
      firstName: poet.profile.firstName,
      age: calculateAge(poet.profile.dob),
      city: poet.profile.location.city,
      country: poet.profile.location.country,
      biography: poet.profile.biography,
      poeticStyles: poet.profile.poeticStyles,
      interests: poet.profile.interests,
      photoUrl: poet.profile.photos[0]?.url,
    },
  }));
}
