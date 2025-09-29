export const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
] as const;

export type HoursRecord = Record<string, string>;

type HoursRange = {
  startMinutes: number;
  endMinutes: number;
};

const CLOSED_KEYWORDS = ["closed", "appointment only"];

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true
});

function normalizeRange(rawValue: string): string {
  return rawValue.replace(/\u2013/g, "-");
}

function parseTimeString(value: string): number | null {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);

  if (!match) {
    return null;
  }

  const hours = Number.parseInt(match[1] ?? "0", 10);
  const minutes = Number.parseInt(match[2] ?? "0", 10);
  const period = match[3]?.toUpperCase();

  if (Number.isNaN(hours) || Number.isNaN(minutes) || !period) {
    return null;
  }

  const normalizedHours = hours % 12 + (period === "PM" ? 12 : 0);

  return normalizedHours * 60 + minutes;
}

function parseHoursRange(value: string): HoursRange | null {
  const normalized = normalizeRange(value);
  const [start, end] = normalized.split("-");

  if (!start || !end) {
    return null;
  }

  const startMinutes = parseTimeString(start);
  const endMinutes = parseTimeString(end);

  if (startMinutes === null || endMinutes === null) {
    return null;
  }

  return {
    startMinutes,
    endMinutes
  };
}

function containsClosedKeyword(value: string): boolean {
  const normalized = value.toLowerCase();
  return CLOSED_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

export function getDayLabel(date: Date = new Date()): (typeof WEEK_DAYS)[number] {
  return WEEK_DAYS[date.getDay()];
}

export function getTodayHours(
  hours: HoursRecord,
  date: Date = new Date()
): string | null {
  const day = getDayLabel(date);
  const value = hours[day];

  if (!value) {
    return null;
  }

  return value;
}

export function isOpenNow(hours: HoursRecord, date: Date = new Date()): boolean {
  const todayHours = getTodayHours(hours, date);

  if (!todayHours || containsClosedKeyword(todayHours)) {
    return false;
  }

  const range = parseHoursRange(todayHours);

  if (!range) {
    return false;
  }

  const minutesNow = date.getHours() * 60 + date.getMinutes();

  return minutesNow >= range.startMinutes && minutesNow < range.endMinutes;
}

export function formatMinutesToDisplay(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return timeFormatter.format(date);
}

export function getOrderedHours(hours: HoursRecord): Array<{
  day: string;
  value: string;
}> {
  return WEEK_DAYS.filter((day) => Boolean(hours[day])).map((day) => ({
    day,
    value: hours[day] as string
  }));
}
