import type { StartingBalance } from "../types/balance";
import type { Occurrence, Transaction } from "../types/transaction";
import { addDays, weekStartOf } from "./date";
import { getOccurrences, signedAmount } from "./recurrence";

const NEXT_INCOME_LOOKAHEAD_DAYS = 62;
const PAID_EARLY_LOOKAHEAD_DAYS = 366; //how far ahead an item could have been paid early

function earliestDate(transactions: Transaction[], fallback: string): string {
    return transactions.reduce((min, t) => (t.date < min ? t.date : min), fallback);
}

//When saving a balance: every occurrence whose money is already in it. That's anything marked
//paid/received on or before the balance date, plus the same-day items the user ticked.
export function buildIncludedKeys(transactions: Transaction[], asOf: string, today: string, tickedKeys: string[]): string[] {
    const from = earliestDate(transactions, asOf);
    const occurrences = getOccurrences(transactions, from, addDays(asOf, PAID_EARLY_LOOKAHEAD_DAYS), today);
    const done = occurrences.filter(o => o.actualDate && o.actualDate <= asOf).map(o => o.key);
    return [...new Set([...done, ...tickedKeys])];
}

const includedSets = new WeakMap<string[], Set<string>>();

export function isInBalance(occurrence: Occurrence, balance: StartingBalance): boolean {
    if (balance.included) {
        let set = includedSets.get(balance.included);
        if (!set) includedSets.set(balance.included, set = new Set(balance.included));
        return set.has(occurrence.key);
    }
    return Boolean(occurrence.actualDate && occurrence.actualDate <= balance.asOf);
}

//The day an occurrence's money moves: when it was paid/received, else when it's due.
export function moneyDate(occurrence: Occurrence): string {
    return occurrence.actualDate ?? occurrence.expectedDate;
}

//Does this occurrence move money after the balance was taken? Done items count on the day they
//were paid/received; pending ones on their due date. Anything before the balance date is ignored.
export function countsAgainstBalance(occurrence: Occurrence, balance: StartingBalance | null): boolean {
    if (!balance) return true;
    if (isInBalance(occurrence, balance)) return false;
    return moneyDate(occurrence) >= balance.asOf;
}

export interface BalanceSnapshot {
    currentBalance: number; //starting balance + everything actually paid/received since
    spendingPower: number; //current balance - everything still due before the next income
    dueBeforeIncome: number; //what's still owed (bills, expenses, savings) before the next income
    through: string; //last day spending power has to last
    nextIncome?: Occurrence; //earliest income that hasn't arrived yet (can be late)
}

export function getBalanceSnapshot(transactions: Transaction[], balance: StartingBalance, today: string): BalanceSnapshot {
    const from = earliestDate(transactions, balance.asOf < today ? balance.asOf : today);
    const occurrences = getOccurrences(transactions, from, addDays(today, PAID_EARLY_LOOKAHEAD_DAYS), today)
        .filter(o => countsAgainstBalance(o, balance));

    //Happened: marked paid/received (or auto-saved) by today. Anything else is still pending,
    //including items marked with a future paid date.
    const happened = (o: Occurrence) => Boolean(o.actualDate && o.actualDate <= today);
    const currentBalance = occurrences
        .filter(happened)
        .reduce((sum, o) => sum + signedAmount(o), balance.amount);

    //The next paycheck is the earliest income not received yet, even if it's late.
    const pending = occurrences.filter(o => !happened(o));
    const nextIncome = pending.find(o => o.transaction.type === "Income" && o.expectedDate <= addDays(today, NEXT_INCOME_LOOKAHEAD_DAYS));
    const through = nextIncome
        ? (nextIncome.expectedDate > today ? addDays(nextIncome.expectedDate, -1) : today)
        : addDays(weekStartOf(today), 6);

    //Still owed before then, including anything overdue since the balance date. Pending income is
    //never counted: spending power only uses money that has actually arrived.
    const dueBeforeIncome = pending
        .filter(o => o.transaction.type !== "Income" && o.expectedDate <= through)
        .reduce((sum, o) => sum + o.transaction.amount, 0);

    return { currentBalance, spendingPower: currentBalance - dueBeforeIncome, dueBeforeIncome, through, nextIncome };
}
