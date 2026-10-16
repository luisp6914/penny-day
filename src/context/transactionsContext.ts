import { createContext } from "react";
import type { Debt, NewDebt } from "../types/debt";
import type { NewTransaction, Transaction } from "../types/transaction";

export interface TransactionsContextValue {
    transactions: Transaction[];
    addTransaction: (input: NewTransaction) => string; //returns the new id
    updateTransaction: (id: string, input: NewTransaction) => void;
    deleteTransaction: (id: string) => void;
    skipOccurrence: (id: string, expectedDate: string) => void; //delete only this repeat
    endSeriesBefore: (id: string, expectedDate: string) => void; //delete this repeat and every later one
    completeOccurrence: (id: string, expectedDate: string, actualDate: string) => void;
    reopenOccurrence: (id: string, expectedDate: string) => void;
}

export const TransactionsContext = createContext<TransactionsContextValue | null>(null);

export interface DebtsContextValue {
    debts: Debt[];
    addDebt: (input: NewDebt) => void;
    updateDebt: (id: string, input: NewDebt) => void;
    deleteDebt: (id: string) => void;
}

export const DebtsContext = createContext<DebtsContextValue | null>(null);
