import type { Category } from "../types/category"
import type { TransactionType } from "../types/transaction";

//ids are stored on saved transactions, so never renumber; only append.
export const DEFAULT_CATEGORIES: readonly Category[] = [
    {id: 1, name: "Paycheck", color: "#2EC4B6", types: ["Income"]},
    {id: 15, name: "Side Income", color: "#06D6A0", types: ["Income"]},
    {id: 2, name: "Rent", color: "#4A90E2", types: ["Bill"]},
    {id: 6, name: "Utilities", color: "#E63946", types: ["Bill"]},
    {id: 7, name: "Subscriptions", color: "#8A5CF6", types: ["Bill"]},
    {id: 17, name: "Insurance", color: "#5E81AC", types: ["Bill"]},
    {id: 13, name: "Loan Payment", color: "#F72585", types: ["Bill"]},
    {id: 14, name: "Credit Card", color: "#FF7F51", types: ["Bill"]},
    {id: 3, name: "Groceries", color: "#4CAF50", types: ["Expense"]},
    {id: 4, name: "Gas", color: "#F4A261", types: ["Expense"]},
    {id: 5, name: "Eating Out", color: "#E76F51", types: ["Expense"]},
    {id: 8, name: "Pets", color: "#FFB703", types: ["Expense"]},
    {id: 9, name: "School", color: "#A8DADC", types: ["Expense", "Bill"]},
    {id: 10, name: "Self-Care", color: "#F15BB5", types: ["Expense"]},
    {id: 11, name: "Savings", color: "#10B981", types: ["Savings"]},
    {id: 16, name: "Emergency Fund", color: "#38BDF8", types: ["Savings"]},
    {id: 18, name: "Stocks", color: "#A3E635", types: ["Savings"]},
    {id: 19, name: "Retirement (401k / IRA)", color: "#C084FC", types: ["Savings"]},
    {id: 12, name: "Other", color: "#6B7280", types: ["Income", "Expense", "Bill", "Savings"]}
];

export const OTHER_CATEGORY_ID = 12;
export const LOAN_CATEGORY_ID = 13;
export const CREDIT_CARD_CATEGORY_ID = 14;

export function getCategory(id: Category["id"]): Category {
    return DEFAULT_CATEGORIES.find(c => c.id === id) ?? DEFAULT_CATEGORIES.find(c => c.id === OTHER_CATEGORY_ID)!;
}

export function getCategoriesForType(type: TransactionType): Category[] {
    return DEFAULT_CATEGORIES.filter(c => c.types.includes(type));
}
