/**
 * Calculates age in years from a date of birth string (YYYY-MM-DD)
 */
export function calculateAge(dob: string, referenceDate: Date = new Date()): number {
  if (!dob) return 0;
  const [yearStr, monthStr, dayStr] = dob.split('-');
  const birthYear = parseInt(yearStr, 10);
  const birthMonth = parseInt(monthStr, 10);
  const birthDay = parseInt(dayStr, 10);

  if (isNaN(birthYear) || isNaN(birthMonth) || isNaN(birthDay)) {
    return 0;
  }

  const todayYear = referenceDate.getFullYear();
  const todayMonth = referenceDate.getMonth() + 1;
  const todayDay = referenceDate.getDate();

  let age = todayYear - birthYear;
  if (todayMonth < birthMonth || (todayMonth === birthMonth && todayDay < birthDay)) {
    age--;
  }

  return Math.max(0, age);
}

/**
 * Returns an excerpt from a multi-line poem body
 */
export function formatPoemExcerpt(body: string, maxLines: number = 4): string {
  if (!body) return '';
  const lines = body.split('\n').filter(l => l.trim().length > 0);
  if (lines.length <= maxLines) {
    return body;
  }
  return lines.slice(0, maxLines).join('\n') + '\n...';
}
