import type { TransactionType } from "../types/transaction";

export const TRANSACTION_TYPES: readonly TransactionType[] = ["Income", "Expense", "Bill", "Savings"];

//Keep in sync with --color-income/expense/bill/savings in index.css
export const TYPE_COLORS: Record<TransactionType, string> = {
    Income: "#22C55E",
    Expense: "#F87171",
    Bill: "#FBBF24",
    Savings: "#38BDF8",
};

//Category picked automatically when the user switches type (ids from DEFAULT_CATEGORIES)
export const DEFAULT_CATEGORY_FOR_TYPE: Partial<Record<TransactionType, number>> = {
    Income: 1,
    Savings: 11,
};

export const COMPLETED_LABEL: Record<TransactionType, string> = {
    Income: "Received",
    Expense: "Paid",
    Bill: "Paid",
    Savings: "Saved",
};
