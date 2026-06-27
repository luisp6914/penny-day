import type { RecurrenceRule } from "./recurrence";
import type { Category } from "./category";

export type TransactionDirection = "Income" | "Expense";
export type TransactionStatus = "Paid" | "Unpaid" | "In progress";

export interface Transaction {
    // id: string;
    title: string;
    description: string;
    amount: number;
    date: Date;
    type: TransactionDirection;
    status: TransactionStatus;
    categoryId: Category["id"];
    isRecurring: boolean;
    recurrence?: RecurrenceRule;
    reminder?: string;
    reminderDate?: Date;

    // note?: string; //the ? is probably going to be a custom message to add maybe we can change this to reminder

}