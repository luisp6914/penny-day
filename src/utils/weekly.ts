import type { Occurrence, Transaction } from "../types/transaction";
import { addDays, weekStartOf } from "./date";
import { getOccurrences, signedAmount } from "./recurrence";

export interface WeekSummary {
    start: string; //Sunday
    end: string; //Saturday
    carriedOver: number; //what was left at the end of the previous week (can be negative)
    income: number;
    expenses: number; //expenses + bills due this week
    savings: number;
    remaining: number; //carriedOver + income - expenses - savings, carried into next week
}

function earliestDate(transactions: Transaction[], fallback: string): string {
    return transactions.reduce((min, t) => (t.date < min ? t.date : min), fallback);
}

//Week-by-week running balance. The chain starts at the user's first transaction so every
//week's leftover rolls into the next, then only the weeks touching from..to are returned.
export function getWeeklySummaries(transactions: Transaction[], from: string, to: string): WeekSummary[] {
    const firstWeek = weekStartOf(earliestDate(transactions, from));
    const lastWeek = weekStartOf(to);
    const occurrences = getOccurrences(transactions, firstWeek, addDays(lastWeek, 6));

    const byWeek = new Map<string, Occurrence[]>();
    for (const occurrence of occurrences) {
        const week = weekStartOf(occurrence.expectedDate);
        byWeek.set(week, [...(byWeek.get(week) ?? []), occurrence]);
    }

    const summaries: WeekSummary[] = [];
    let carriedOver = 0;
    for (let start = firstWeek; start <= lastWeek; start = addDays(start, 7)) {
        let income = 0, expenses = 0, savings = 0;
        for (const { transaction } of byWeek.get(start) ?? []) {
            if (transaction.type === "Income") income += transaction.amount;
            else if (transaction.type === "Savings") savings += transaction.amount;
            else expenses += transaction.amount;
        }
        const end = addDays(start, 6);
        const remaining = carriedOver + income - expenses - savings;
        if (end >= from) summaries.push({ start, end, carriedOver, income, expenses, savings, remaining });
        carriedOver = remaining;
    }
    return summaries;
}

export interface SafeToSpend {
    amount: number;
    through: string; //last day the amount has to last
    nextIncome?: Occurrence;
}

const NEXT_INCOME_LOOKAHEAD_DAYS = 62;

//What's left to spend until the next paycheck: every planned flow up to the day before it.
//With no income coming up, it covers through the end of this week instead.
export function getSafeToSpend(transactions: Transaction[], today: string): SafeToSpend {
    const from = earliestDate(transactions, today);
    const occurrences = getOccurrences(transactions, from, addDays(today, NEXT_INCOME_LOOKAHEAD_DAYS));
    const nextIncome = occurrences.find(o => o.transaction.type === "Income" && o.expectedDate > today);
    const through = nextIncome ? addDays(nextIncome.expectedDate, -1) : addDays(weekStartOf(today), 6);

    const amount = occurrences
        .filter(o => o.expectedDate <= through)
        .reduce((sum, o) => sum + signedAmount(o), 0);

    return { amount, through, nextIncome };
}
