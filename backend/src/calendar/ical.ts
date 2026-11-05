export type StayRange = {
  checkIn: string;
  checkOut: string;
  uid?: string;
};

export function parseIcal(text: string): StayRange[] {
  const unfolded = text.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "");
  const ranges: StayRange[] = [];

  for (const event of unfolded.split(/BEGIN:VEVENT/i).slice(1)) {
    const body = event.split(/END:VEVENT/i)[0] ?? "";
    const checkIn = readDate(body, "DTSTART");
    const checkOut = readDate(body, "DTEND");
    if (!checkIn || !checkOut || checkOut <= checkIn) continue;
    ranges.push({ checkIn, checkOut, uid: readProp(body, "UID") });
  }

  return ranges;
}

export function directCalendar(ranges: { id: string; checkIn: string; checkOut: string }[]) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const events = ranges.map((range) =>
    [
      "BEGIN:VEVENT",
      `UID:sky12-${range.id}@sky12.lu`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${range.checkIn.replaceAll("-", "")}`,
      `DTEND;VALUE=DATE:${range.checkOut.replaceAll("-", "")}`,
      "SUMMARY:Not available",
      "TRANSP:OPAQUE",
      "END:VEVENT",
    ].join("\r\n"),
  );

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//sky12.lu//Sky12//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

function readProp(body: string, name: string) {
  const match = body.match(new RegExp(`^${name}(?:;[^:]*)?:(.*)$`, "im"));
  return match?.[1]?.trim();
}

function readDate(body: string, name: string) {
  const raw = readProp(body, name);
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 8) return null;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}
