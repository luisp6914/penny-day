import type { Transaction } from "../types/transaction";

export function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month - 1, 1).getDay()
}

export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}

export function compareDates(date1: string, date2: string): boolean {
    return date1 === date2;
}

export function filterTransactionsByDate(transactions: Transaction[], date: string): Transaction[] {
    return transactions.filter(tx => compareDates(tx.date, date));
}

export function filterTransactionsByMonth(
    transactions: Transaction[],
    year: number,
    month: number
): Transaction[] {
    return transactions.filter(tx =>
        tx.date.startsWith(`${year}-${String(month).padStart(2, "0")}`)
    );
}


