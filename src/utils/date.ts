const pad = (n: number) => String(n).padStart(2, "0");

//Local "YYYY-MM-DD" (toISOString() would give the UTC date, which is tomorrow on US evenings).
export function toDateKey(date: Date): string {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDateKey(key: string): Date {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export function todayKey(): string {
    return toDateKey(new Date());
}

export function addDays(key: string, days: number): string {
    const date = parseDateKey(key);
    date.setDate(date.getDate() + days);
    return toDateKey(date);
}

export function daysBetween(from: string, to: string): number {
    return Math.round((parseDateKey(to).getTime() - parseDateKey(from).getTime()) / 86_400_000);
}

//month is 0-11
export function daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

export interface MonthRef {
    year: number;
    month: number; //0-11
}

export function monthOf(key: string): MonthRef {
    const date = parseDateKey(key);
    return { year: date.getFullYear(), month: date.getMonth() };
}

export function shiftMonth({ year, month }: MonthRef, delta: number): MonthRef {
    const date = new Date(year, month + delta, 1);
    return { year: date.getFullYear(), month: date.getMonth() };
}

export function monthBounds({ year, month }: MonthRef): { start: string; end: string } {
    return {
        start: toDateKey(new Date(year, month, 1)),
        end: toDateKey(new Date(year, month, daysInMonth(year, month))),
    };
}

export function formatMonth({ year, month }: MonthRef): string {
    return new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatLongDate(key: string): string {
    return parseDateKey(key).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

export function formatShortDate(key: string): string {
    return parseDateKey(key).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function ordinal(n: number): string {
    const rem100 = n % 100;
    if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
    return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}

//Same day N months later, clamped to the end of shorter months (Jan 31 + 1 month = Feb 28).
export function addMonths(key: string, months: number): string {
    const date = parseDateKey(key);
    const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
    target.setDate(Math.min(date.getDate(), daysInMonth(target.getFullYear(), target.getMonth())));
    return toDateKey(target);
}

//Weeks run Sunday to Saturday, matching the calendar.
export function weekStartOf(key: string): string {
    return addDays(key, -parseDateKey(key).getDay());
}

//The 4-6 Sunday-start weeks covering a month, each as 7 date keys.
export function getMonthWeeks(month: MonthRef): string[][] {
    const { start, end } = monthBounds(month);
    const weeks: string[][] = [];
    for (let weekStart = weekStartOf(start); weekStart <= end; weekStart = addDays(weekStart, 7)) {
        weeks.push(Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)));
    }
    return weeks;
}

export function formatDayMonth(key: string): string {
    return parseDateKey(key).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatRange(start: string, end: string): string {
    const sameMonth = start.slice(0, 7) === end.slice(0, 7);
    return `${formatDayMonth(start)} – ${sameMonth ? parseDateKey(end).getDate() : formatDayMonth(end)}`;
}

export function formatFullDate(key: string): string {
    return parseDateKey(key).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
