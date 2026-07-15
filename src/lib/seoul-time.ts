export function getNextSeoulMidnight(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return new Date(date.getTime() + 24 * 60 * 60 * 1000);
  }

  return new Date(Date.UTC(year, month - 1, day, 15, 0, 0));
}

export function getSecondsUntilNextSeoulMidnight(date = new Date()) {
  return Math.max(1, Math.ceil((getNextSeoulMidnight(date).getTime() - date.getTime()) / 1000));
}
