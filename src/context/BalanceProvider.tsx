import { useEffect, useMemo, useState } from "react";
import type { StartingBalance } from "../types/balance";
import { BALANCE_KEY, loadStartingBalance, saveStartingBalance, subscribeToOtherTabs } from "../utils/storage";
import { BalanceContext, type BalanceContextValue } from "./transactionsContext";

const BalanceProvider = ({ children }: { children: React.ReactNode }) => {
    const [startingBalance, setStartingBalance] = useState<StartingBalance | null>(loadStartingBalance);

    useEffect(() => {
        saveStartingBalance(startingBalance);
    }, [startingBalance]);

    useEffect(() => subscribeToOtherTabs(BALANCE_KEY, () => setStartingBalance(loadStartingBalance())), []);

    const value = useMemo<BalanceContextValue>(() => ({ startingBalance, setStartingBalance }), [startingBalance]);

    return <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>;
};

export default BalanceProvider;
