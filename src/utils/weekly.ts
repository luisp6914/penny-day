import type { StartingBalance } from "../types/balance";
import type { Occurrence, Transaction } from "../types/transaction";
import { addDays, weekStartOf } from "./date";
import { getOccurrences, signedAmount } from "./recurrence";

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

//A starting balance is what's in the account on its date. An occurrence still has to come out
//of (or go into) it unless it's dated before then, or was already paid/received by then.
export function countsAgainstBalance(occurrence: Occurrence, balance: StartingBalance | null): boolean {
    if (!balance) return true;
    if (occurrence.actualDate && occurrence.actualDate <= balance.asOf) return false;
    return occurrence.expectedDate >= balance.asOf;
}

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
    const occurrences = getOccurrences(transactions, firstWeek, addDays(lastWeek, 6), today);

    const byWeek = new Map<string, Occurrence[]>();
    for (const occurrence of occurrences) {
        const week = weekStartOf(occurrence.expectedDate);
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

export interface SafeToSpend {
    amount: number;
    through: string; //last day the amount has to last
    nextIncome?: Occurrence;
}

const NEXT_INCOME_LOOKAHEAD_DAYS = 62;

//What's left to spend until the next paycheck: the starting balance plus every planned flow
//up to the day before it. With no income coming up, it covers through the end of this week instead.
export function getSafeToSpend(transactions: Transaction[], today: string, balance: StartingBalance | null = null): SafeToSpend {
    const start = chainStart(transactions, today, balance);
    const from = start < today ? start : today;
    const occurrences = getOccurrences(transactions, from, addDays(today, NEXT_INCOME_LOOKAHEAD_DAYS), today);
    const nextIncome = occurrences.find(o => o.transaction.type === "Income" && o.expectedDate > today);
    const through = nextIncome ? addDays(nextIncome.expectedDate, -1) : addDays(weekStartOf(today), 6);

    const amount = occurrences
        .filter(o => o.expectedDate <= through && countsAgainstBalance(o, balance))
        .reduce((sum, o) => sum + signedAmount(o), balance?.amount ?? 0);

    return { amount, through, nextIncome };
}
