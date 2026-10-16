import type { MonthlyAnchorConfig, RecurrenceRule } from "../types/recurrence";
import type { Occurrence, Transaction, TransactionType } from "../types/transaction";
import { addDays, daysBetween, daysInMonth, ordinal, parseDateKey, toDateKey, WEEKDAYS } from "./date";

const TYPE_ORDER: Record<TransactionType, number> = { Income: 0, Bill: 1, Expense: 2, Savings: 3 };

function resolveAnchorDay(anchor: MonthlyAnchorConfig, year: number, month: number): number {
    const lastDay = daysInMonth(year, month);
    if (anchor.anchor === "FirstDay") return 1;
    if (anchor.anchor === "LastDay") return lastDay;
    return Math.min(anchor.dayOfMonth ?? 1, lastDay);
}

//Expected dates of a transaction between from and to (inclusive), in order.
export function expectedDatesBetween(transaction: Transaction, from: string, to: string): string[] {
    const rule = transaction.recurrence;
    if (!rule) return transaction.date >= from && transaction.date <= to ? [transaction.date] : [];

    const first = transaction.date > from ? transaction.date : from;
    const last = rule.endDate && rule.endDate < to ? rule.endDate : to;
    if (first > last) return [];

    const dates: string[] = [];

    if (rule.frequency === "Monthly") {
        const end = parseDateKey(last);
        const cursor = parseDateKey(first);
        cursor.setDate(1);
        while (cursor <= end) {
            const year = cursor.getFullYear();
            const month = cursor.getMonth();
            for (const anchor of rule.anchors) {
                const key = toDateKey(new Date(year, month, resolveAnchorDay(anchor, year, month)));
                if (key >= first && key <= last) dates.push(key);
            }
            cursor.setMonth(month + 1);
        }
        return [...new Set(dates)].sort();
    }

    //Weekly/biweekly: the cadence is anchored to the first matching weekday on/after the start date.
    const step = rule.frequency === "Weekly" ? 7 : 14;
    const offset = (rule.dayOfWeek - parseDateKey(transaction.date).getDay() + 7) % 7;
    let current = addDays(transaction.date, offset);
    if (current < first) {
        current = addDays(current, Math.ceil(daysBetween(current, first) / step) * step);
    }
    for (; current <= last; current = addDays(current, step)) dates.push(current);
    return dates;
}

//Every occurrence expected between from and to (inclusive), minus repeats the user skipped.
export function getOccurrences(transactions: Transaction[], from: string, to: string): Occurrence[] {
    const occurrences: Occurrence[] = [];

    for (const transaction of transactions) {
        const skipped = new Set(transaction.skippedDates);
        for (const expectedDate of expectedDatesBetween(transaction, from, to)) {
            if (skipped.has(expectedDate)) continue;
            occurrences.push({
                key: `${transaction.id}:${expectedDate}`,
                transaction,
                expectedDate,
                actualDate: transaction.completions[expectedDate],
            });
        }
    }

    return occurrences.sort((a, b) =>
        a.expectedDate.localeCompare(b.expectedDate)
        || TYPE_ORDER[a.transaction.type] - TYPE_ORDER[b.transaction.type]
        || a.transaction.title.localeCompare(b.transaction.title)
    );
}

//Money in is positive, money out (expenses, bills, savings) is negative.
export function signedAmount({ transaction }: Occurrence): number {
    return transaction.type === "Income" ? transaction.amount : -transaction.amount;
}

function describeAnchor(anchor: MonthlyAnchorConfig): string {
    if (anchor.anchor === "FirstDay") return "1st";
    if (anchor.anchor === "LastDay") return "last day";
    return ordinal(anchor.dayOfMonth ?? 1);
}

export function describeRecurrence(rule: RecurrenceRule): string {
    if (rule.frequency !== "Monthly") {
        return `${rule.frequency === "Weekly" ? "Weekly" : "Every 2 weeks"} on ${WEEKDAYS[rule.dayOfWeek]}`;
    }
    if (rule.anchors.length > 1) return `Twice a month (${rule.anchors.map(describeAnchor).join(" & ")})`;
    return `Monthly on the ${describeAnchor(rule.anchors[0])}`;
}
