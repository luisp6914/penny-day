export type TransactionsType = "Incoming Money" | "Subscriptions" | "Bills";
export type TransactionStatus = "Paid" | "Unpaid" | "In progress";
export type RecurringType = "Bills" | "Subscriptions" | "Groceries" | "Other";

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: Date;
    type: TransactionsType;
    status: TransactionStatus;
    recurring: RecurringType;
    reminder?: string;
    reminderDate?: Date;
   // note?: string; //the ? is probably going to be a custom message to add maybe we can change this to reminder
   
}