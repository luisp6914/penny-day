import type { Category } from "../types/category"

export const DEFAULT_CATEGORIES: Category[] = [
    {id: 1, name: "Income", color: "#2EC4B6"},
    {id: 2, name: "Rent", color: "#4A90E2"},
    {id: 3, name: "Groceries", color: "#4CAF50"},
    {id: 4, name: "Gas", color: "#F4A261"},
    {id: 5, name: "Eating Out", color: "#E76F51"},
    {id: 6, name: "Bills", color: "#E63946"},
    {id: 7, name: "Subscriptions", color: "#8A5CF6"},
    {id: 8, name: "Pets", color: "#FFB703"},
    {id: 9, name: "School", color: "#A8DADC"},
    {id: 10, name: "Self-Care", color: "#F15BB5"},
    {id: 11, name: "Savings", color: "#10B981"},
    {id: 12, name: "Other", color: "#6B7280"}
] as const;