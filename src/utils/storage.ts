import type { StartingBalance } from "../types/balance";
import type { Debt } from "../types/debt";
import type { Transaction } from "../types/transaction";

export const TRANSACTIONS_KEY = "pennyday:transactions:v1";
export const DEBTS_KEY = "pennyday:debts:v1";
export const BALANCE_KEY = "pennyday:startingBalance:v1";

function isTransaction(value: unknown): value is Transaction {
    if (typeof value !== "object" || value === null) return false;
    const t = value as Record<string, unknown>;
    return typeof t.id === "string"
        && typeof t.title === "string"
        && typeof t.amount === "number"
        && typeof t.date === "string"
        && typeof t.type === "string"
        && typeof t.categoryId === "number";
}

function isDebt(value: unknown): value is Debt {
    if (typeof value !== "object" || value === null) return false;
    const d = value as Record<string, unknown>;
    return typeof d.id === "string"
        && typeof d.name === "string"
        && typeof d.balance === "number"
        && typeof d.apr === "number"
        && typeof d.monthlyPayment === "number"
        && typeof d.firstPaymentDate === "string";
}

function loadList<T>(key: string, isValid: (value: unknown) => value is T): T[] {
    try {
        const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
        return Array.isArray(parsed) ? parsed.filter(isValid) : [];
    } catch {
        return [];
    }
}

export function loadTransactions(): Transaction[] {
    return loadList(TRANSACTIONS_KEY, isTransaction).map(t => ({ ...t, completions: t.completions ?? {} }));
}

export function loadDebts(): Debt[] {
    return loadList(DEBTS_KEY, isDebt);
}

export function loadStartingBalance(): StartingBalance | null {
    try {
        const parsed: unknown = JSON.parse(localStorage.getItem(BALANCE_KEY) ?? "null");
        if (typeof parsed !== "object" || parsed === null) return null;
        const { amount, asOf, included } = parsed as Record<string, unknown>;
        if (typeof amount !== "number" || typeof asOf !== "string") return null;
        const keys = Array.isArray(included) ? included.filter((k): k is string => typeof k === "string") : undefined;
        return { amount, asOf, included: keys };
    } catch {
        return null;
    }
}

export function saveStartingBalance(balance: StartingBalance | null): void {
    try {
        if (balance) localStorage.setItem(BALANCE_KEY, JSON.stringify(balance));
        else localStorage.removeItem(BALANCE_KEY);
    } catch {
        //Storage can be full or blocked; keep working in memory.
    }
}

export function saveList(key: string, items: unknown[]): void {
    try {
        localStorage.setItem(key, JSON.stringify(items));
    } catch {
        //Storage can be full or blocked (private mode); the app keeps working in memory.
    }
}

//Fires when another tab saves, so two open tabs don't overwrite each other with stale lists.
export function subscribeToOtherTabs(key: string, onChange: () => void): () => void {
    const handleStorage = (e: StorageEvent) => {
        if (e.key === key) onChange();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
}
