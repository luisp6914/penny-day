import { useEffect, useMemo, useState } from "react";
import type { Debt } from "../types/debt";
import { DEBTS_KEY, loadDebts, saveList, subscribeToOtherTabs } from "../utils/storage";
import { DebtsContext, type DebtsContextValue } from "./transactionsContext";

const DebtsProvider = ({ children }: { children: React.ReactNode }) => {
    const [debts, setDebts] = useState<Debt[]>(loadDebts);

    useEffect(() => {
        saveList(DEBTS_KEY, debts);
    }, [debts]);

    useEffect(() => subscribeToOtherTabs(DEBTS_KEY, () => setDebts(loadDebts())), []);

    const value = useMemo<DebtsContextValue>(() => ({
        debts,
        addDebt: (input) => setDebts(prev => [...prev, { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]),
        updateDebt: (id, input) => setDebts(prev => prev.map(d => (d.id === id ? { ...d, termMonths: undefined, promoMonths: undefined, ...input } : d))),
        deleteDebt: (id) => setDebts(prev => prev.filter(d => d.id !== id)),
    }), [debts]);

    return <DebtsContext.Provider value={value}>{children}</DebtsContext.Provider>;
};

export default DebtsProvider;
