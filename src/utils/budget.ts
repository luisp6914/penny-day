import { getCategory } from "../constants/defaultCategories";
import type { BudgetSummary } from "../types/budgetSummary";
import type { Category } from "../types/category";
import type { Occurrence, TransactionType } from "../types/transaction";

//Planned totals: every occurrence counts whether or not it has been paid/received yet.
export function summarizeBudget(occurrences: Occurrence[]): BudgetSummary {
    let totalIncome = 0;
    let totalSpent = 0;
    let totalSaved = 0;

    for (const { transaction } of occurrences) {
        if (transaction.type === "Income") totalIncome += transaction.amount;
        else if (transaction.type === "Savings") totalSaved += transaction.amount;
        else totalSpent += transaction.amount;
    }

    return { totalIncome, totalSpent, totalSaved, remainingBalance: totalIncome - totalSpent - totalSaved };
}

export interface CategoryTotal {
    category: Category;
    type: TransactionType;
    total: number;
    count: number;
}

//Where the money went: spending (expenses + bills) and savings grouped by category, largest first.
export function getOutflowBreakdown(occurrences: Occurrence[]): CategoryTotal[] {
    const totals = new Map<string, CategoryTotal>();

    for (const { transaction } of occurrences) {
        if (transaction.type === "Income") continue;
        const category = getCategory(transaction.categoryId);
        //"Other" can be spending or savings, so keep those apart
        const key = `${category.id}:${transaction.type === "Savings" ? "savings" : "spending"}`;
        const entry = totals.get(key) ?? { category, type: transaction.type, total: 0, count: 0 };
        entry.total += transaction.amount;
        entry.count += 1;
        totals.set(key, entry);
    }

    return [...totals.values()].sort((a, b) => b.total - a.total);
}
