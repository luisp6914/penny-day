import { Icon } from "@iconify/react";
import { useState } from "react";
import { useStartingBalance } from "../../hooks/useTransactions";
import { formatFullDate, todayKey } from "../../utils/date";
import { formatCurrency } from "../../utils/money";
import { inputClass, primaryButtonClass, secondaryButtonClass } from "../ui/styles";

//Lets the user say how much money they actually have, so the weekly running balance starts from reality.
const StartingBalanceCard = () => {
    const { startingBalance, setStartingBalance } = useStartingBalance();
    const [isEditing, setIsEditing] = useState(false);
    const [amount, setAmount] = useState("");
    const [asOf, setAsOf] = useState(todayKey);
    const [error, setError] = useState<string | null>(null);

    const startEditing = () => {
        setAmount(startingBalance ? String(startingBalance.amount) : "");
        setAsOf(startingBalance?.asOf ?? todayKey());
        setError(null);
        setIsEditing(true);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const parsed = Number(amount);
        if (amount.trim() === "" || !Number.isFinite(parsed)) return setError("Enter your balance (it can be negative).");
        if (!asOf) return setError("Pick the date this balance is from.");
        setStartingBalance({ amount: Math.round(parsed * 100) / 100, asOf });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 rounded-xl border border-accent/50 bg-bg-surface p-3">
                <p className="text-sm font-semibold text-white">Starting balance</p>
                <div className="grid grid-cols-2 gap-2">
                    <label className="flex flex-col gap-1 text-xs text-text-muted">
                        Amount in your account
                        <span className="relative">
                            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-text-muted">$</span>
                            <input type="number" inputMode="decimal" step="0.01" autoFocus className={`${inputClass} no-spinner pl-6`} value={amount} onChange={(e) => setAmount(e.target.value)} onWheel={(e) => e.currentTarget.blur()} />
                        </span>
                    </label>
                    <label className="flex flex-col gap-1 text-xs text-text-muted">
                        As of
                        <input type="date" className={inputClass} value={asOf} onChange={(e) => setAsOf(e.target.value)} />
                    </label>
                </div>
                <p className="text-[0.7rem] text-text-muted">
                    Anything dated before this day, or already marked paid or received by then, is treated as already in this balance.
                </p>
                {error && <p role="alert" className="text-xs text-expense">{error}</p>}
                <div className="flex justify-end gap-2">
                    {startingBalance && (
                        <button type="button" className="mr-auto cursor-pointer text-xs text-text-muted hover:text-expense" onClick={() => { setStartingBalance(null); setIsEditing(false); }}>
                            Remove
                        </button>
                    )}
                    <button type="button" className={`${secondaryButtonClass} py-1.5`} onClick={() => setIsEditing(false)}>Cancel</button>
                    <button type="submit" className={`${primaryButtonClass} py-1.5`}>Save</button>
                </div>
            </form>
        );
    }

    if (!startingBalance) {
        return (
            <button type="button" onClick={startEditing} className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-bill/60 bg-bill/5 p-3 text-left transition-colors hover:bg-bill/10">
                <Icon icon="mdi:bank-outline" width={22} height={22} className="shrink-0 text-bill" />
                <span>
                    <span className="block text-sm font-semibold text-white">Set your starting balance</span>
                    <span className="block text-xs text-text-muted">Without it, weekly totals start from $0 and won't match your account.</span>
                </span>
            </button>
        );
    }

    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-bg-surface p-3">
            <div className="flex min-w-0 items-center gap-3">
                <Icon icon="mdi:bank-outline" width={22} height={22} className="shrink-0 text-text-muted" />
                <div className="min-w-0">
                    <p className="text-xs text-text-muted">Starting balance · {formatFullDate(startingBalance.asOf)}</p>
                    <p className={`font-semibold tabular-nums ${startingBalance.amount < 0 ? "text-expense" : "text-white"}`}>
                        {startingBalance.amount < 0 ? "−" : ""}{formatCurrency(Math.abs(startingBalance.amount))}
                    </p>
                </div>
            </div>
            <button type="button" className="shrink-0 cursor-pointer rounded px-2 py-1 text-xs font-medium text-accent-hover hover:bg-accent/10" onClick={startEditing}>
                Update
            </button>
        </div>
    );
};

export default StartingBalanceCard;
