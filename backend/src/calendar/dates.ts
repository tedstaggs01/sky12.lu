const dayPattern = /^\d{4}-\d{2}-\d{2}$/;

export function parseDay(value: string | undefined) {
  if (!value || !dayPattern.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return value;
}

export function addDay(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
}

export function nightsInWindow(checkIn: string, checkOut: string, from: string, to: string) {
  const nights: string[] = [];
  let cursor = checkIn > from ? checkIn : from;
  while (cursor < checkOut && cursor < to) {
    nights.push(cursor);
    cursor = addDay(cursor);
  }
  return nights;
}
