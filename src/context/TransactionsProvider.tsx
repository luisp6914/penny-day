import { useEffect, useMemo, useState } from "react";
import type { Transaction } from "../types/transaction";
import { addDays } from "../utils/date";
import { loadTransactions, saveList, subscribeToOtherTabs, TRANSACTIONS_KEY } from "../utils/storage";
import { TransactionsContext, type TransactionsContextValue } from "./transactionsContext";

const TransactionsProvider = ({ children }: { children: React.ReactNode }) => {
    const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions);

    useEffect(() => {
        saveList(TRANSACTIONS_KEY, transactions);
    }, [transactions]);

    useEffect(() => subscribeToOtherTabs(TRANSACTIONS_KEY, () => setTransactions(loadTransactions())), []);

    const value = useMemo<TransactionsContextValue>(() => {
        const update = (id: string, change: (t: Transaction) => Transaction) =>
            setTransactions(prev => prev.map(t => (t.id === id ? change(t) : t)));

        const remove = (id: string) => setTransactions(prev => prev.filter(t => t.id !== id));

        return {
            transactions,
            addTransaction: (input) => {
                const id = crypto.randomUUID();
                setTransactions(prev => [...prev, { ...input, id, createdAt: new Date().toISOString(), completions: {} }]);
                return id;
            },
            //Edits apply to the whole series; paid/received marks and skipped repeats are kept.
            updateTransaction: (id, input) =>
                update(id, t => ({ ...t, recurrence: undefined, notes: undefined, ...input })),
            deleteTransaction: remove,
            skipOccurrence: (id, expectedDate) => update(id, t => ({
                ...t,
                skippedDates: [...new Set([...(t.skippedDates ?? []), expectedDate])],
            })),
            endSeriesBefore: (id, expectedDate) => setTransactions(prev => prev.flatMap(t => {
                if (t.id !== id) return [t];
                const endDate = addDays(expectedDate, -1);
                if (!t.recurrence || endDate < t.date) return []; //nothing left before it
                return [{ ...t, recurrence: { ...t.recurrence, endDate } }];
            })),
            completeOccurrence: (id, expectedDate, actualDate) =>
                update(id, t => ({ ...t, completions: { ...t.completions, [expectedDate]: actualDate } })),
            reopenOccurrence: (id, expectedDate) => update(id, t => {
                const completions = { ...t.completions };
                delete completions[expectedDate];
                return { ...t, completions };
            }),
        };
    }, [transactions]);

    return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
};

export default TransactionsProvider;
