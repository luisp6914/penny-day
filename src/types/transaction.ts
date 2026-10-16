import type { RecurrenceRule } from "./recurrence";
import type { Category } from "./category";

export type TransactionType = "Income" | "Expense" | "Bill" | "Savings";

//All dates are local "YYYY-MM-DD" strings so they compare/sort as text and survive localStorage.
export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: TransactionType;
    categoryId: Category["id"];
    date: string; //expected date of a one-time transaction, or the first date of a recurring one
    recurrence?: RecurrenceRule;
    completions: Record<string, string>; //expected date -> actual date it was paid/received
    skippedDates?: string[]; //single repeats the user deleted ("only this one")
    notes?: string;
    createdAt: string;
}

export type NewTransaction = Omit<Transaction, "id" | "createdAt" | "completions" | "skippedDates">;

//One dated instance of a transaction (a recurring transaction has many).
//It always stays on its expected date; actualDate only records when it was paid/received.
export interface Occurrence {
    key: string;
    transaction: Transaction;
    expectedDate: string;
    actualDate?: string;
}
