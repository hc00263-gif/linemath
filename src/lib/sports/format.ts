/** "Tue, Aug 25 · 7:00 PM" — used across calendar/match/player pages. */
export function formatGameTime(iso: string): string {
  const date = new Date(iso);
  const datePart = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${datePart} · ${timePart}`;
}

/** "Jan 18 – Feb 1, 2026" for a tournament date range. */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const startPart = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endPart = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${startPart} – ${endPart}`;
}
