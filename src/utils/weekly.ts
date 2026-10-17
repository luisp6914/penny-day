import type { StartingBalance } from "../types/balance";
import type { Occurrence, Transaction } from "../types/transaction";
import { addDays, weekStartOf } from "./date";
import { countsAgainstBalance, moneyDate } from "./balance";
import { getOccurrences } from "./recurrence";

export interface WeekSummary {
    start: string; //Sunday
    end: string; //Saturday
    carriedOver: number; //previous week's leftover, or the starting balance in the week it was set
    startsBalance: boolean; //true for the week the starting balance was entered in
    beforeBalance: boolean; //true for weeks that end before the starting balance date (not tracked)
    income: number;
    expenses: number; //expenses + bills due this week
    savings: number;
    remaining: number; //carriedOver + income - expenses - savings, carried into next week
}

const PAID_EARLY_LOOKAHEAD_DAYS = 366;

function earliestDate(transactions: Transaction[], fallback: string): string {
    return transactions.reduce((min, t) => (t.date < min ? t.date : min), fallback);
}

//Where the running balance starts: the starting balance date, or (without one) the first transaction.
function chainStart(transactions: Transaction[], from: string, balance: StartingBalance | null): string {
    return balance ? balance.asOf : earliestDate(transactions, from);
}

//Week-by-week running balance. Each week's leftover rolls into the next; only the weeks
//touching from..to are returned.
export function getWeeklySummaries(
    transactions: Transaction[],
    from: string,
    to: string,
    balance: StartingBalance | null = null,
    today?: string,
): WeekSummary[] {
    const start = chainStart(transactions, from, balance);
    const firstWeek = weekStartOf(start < from ? start : from);
    const balanceWeek = balance ? weekStartOf(balance.asOf) : null;
    const lastWeek = weekStartOf(to);
    //Look past the last week too: something due later may have been paid early inside the range.
    const occurrences = getOccurrences(transactions, firstWeek, addDays(lastWeek, 6 + PAID_EARLY_LOOKAHEAD_DAYS), today);

    //Counted items land in the week their money moved (paid early = the week it was paid).
    const byWeek = new Map<string, Occurrence[]>();
    for (const occurrence of occurrences) {
        const counted = balance !== null && countsAgainstBalance(occurrence, balance);
        const week = weekStartOf(counted ? moneyDate(occurrence) : occurrence.expectedDate);
        byWeek.set(week, [...(byWeek.get(week) ?? []), occurrence]);
    }

    const summaries: WeekSummary[] = [];
    let carriedOver = 0;
    for (let weekStart = firstWeek; weekStart <= lastWeek; weekStart = addDays(weekStart, 7)) {
        const beforeBalance = balanceWeek !== null && weekStart < balanceWeek;
        const startsBalance = weekStart === balanceWeek;
        if (startsBalance) carriedOver = balance!.amount;

        let income = 0, expenses = 0, savings = 0;
        for (const occurrence of byWeek.get(weekStart) ?? []) {
            if (!beforeBalance && !countsAgainstBalance(occurrence, balance)) continue;
            const { type, amount } = occurrence.transaction;
            if (type === "Income") income += amount;
            else if (type === "Savings") savings += amount;
            else expenses += amount;
        }

        const end = addDays(weekStart, 6);
        //Weeks before the balance date aren't part of the running total; show their activity only.
        const carried = beforeBalance ? 0 : carriedOver;
        const remaining = carried + income - expenses - savings;
        if (end >= from) {
            summaries.push({ start: weekStart, end, carriedOver: carried, startsBalance, beforeBalance, income, expenses, savings, remaining });
        }
        if (!beforeBalance) carriedOver = remaining;
    }
    return summaries;
}
