import { useContext, useMemo } from "react";
import { BalanceContext, DebtsContext, TransactionsContext } from "../context/transactionsContext";
import { getOccurrences } from "../utils/recurrence";

export function useTransactions() {
    const context = useContext(TransactionsContext);
    if (!context) throw new Error("useTransactions must be used inside <TransactionsProvider>");
    return context;
}

export function useDebts() {
    const context = useContext(DebtsContext);
    if (!context) throw new Error("useDebts must be used inside <DebtsProvider>");
    return context;
}

export function useStartingBalance() {
    const context = useContext(BalanceContext);
    if (!context) throw new Error("useStartingBalance must be used inside <BalanceProvider>");
    return context;
}

//Occurrences expected between from and to (inclusive, "YYYY-MM-DD").
export function useOccurrences(from: string, to: string) {
    const { transactions } = useTransactions();
    return useMemo(() => getOccurrences(transactions, from, to), [transactions, from, to]);
}
