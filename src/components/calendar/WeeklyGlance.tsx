import { useMemo } from "react";
import { useStartingBalance, useTransactions } from "../../hooks/useTransactions";
import { formatMonth, formatRange, formatShortDate, monthBounds, todayKey, type MonthRef } from "../../utils/date";
import { formatCurrency } from "../../utils/money";
import { getBalanceSnapshot } from "../../utils/balance";
import { getWeeklySummaries, type WeekSummary } from "../../utils/weekly";
import StartingBalanceCard from "./StartingBalanceCard";

const signed = (n: number) => `${n < 0 ? "−" : ""}${formatCurrency(Math.abs(n))}`;

const Row = ({ label, value, className = "" }: { label: string; value: string; className?: string }) => (
    <div className="flex items-baseline justify-between gap-2">
        <dt className="text-text-muted">{label}</dt>
        <dd className={`tabular-nums ${className}`}>{value}</dd>
    </div>
);

const WeekCard = ({ week, isCurrent }: { week: WeekSummary; isCurrent: boolean }) => (
    <li className={`rounded-lg border p-3 ${isCurrent ? "border-accent/60 bg-accent/[0.07]" : "border-border-subtle bg-bg-surface"} ${week.beforeBalance ? "opacity-60" : ""}`}>
        <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-white">{formatRange(week.start, week.end)}</p>
            {isCurrent && <span className="rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-semibold text-white uppercase">This week</span>}
        </div>
        <dl className="grid gap-1 text-xs">
            {week.beforeBalance
                ? <p className="text-text-muted">Before your starting balance, so not counted.</p>
                : <Row label={week.startsBalance ? "Starting balance" : "Carried over"} value={signed(week.carriedOver)} className={week.carriedOver < 0 ? "text-expense" : "text-white"} />}
            <Row label="Income" value={`+${formatCurrency(week.income)}`} className="text-income" />
            <Row label="Incoming expenses" value={`−${formatCurrency(week.expenses)}`} className="text-expense" />
            {week.savings > 0 && <Row label="Savings" value={`−${formatCurrency(week.savings)}`} className="text-savings" />}
        </dl>
        <div className="mt-2 flex items-baseline justify-between border-t border-border-subtle pt-2">
            <span className="text-xs text-text-muted">{week.beforeBalance ? "Net this week" : "Left for next week"}</span>
            <span className={`font-semibold tabular-nums ${week.remaining < 0 ? "text-expense" : "text-white"}`}>{signed(week.remaining)}</span>
        </div>
    </li>
);

const WeeklyGlance = ({ month }: { month: MonthRef }) => {
    const { transactions } = useTransactions();
    const { startingBalance } = useStartingBalance();
    const today = todayKey();

    const weeks = useMemo(() => {
        const { start, end } = monthBounds(month);
        return getWeeklySummaries(transactions, start, end, startingBalance);
    }, [transactions, month, startingBalance]);

    const snapshot = useMemo(
        () => (startingBalance ? getBalanceSnapshot(transactions, startingBalance, today) : null),
        [transactions, today, startingBalance],
    );
    const nextIncome = snapshot?.nextIncome;
    const isIncomeLate = nextIncome !== undefined && nextIncome.expectedDate < today;

    return (
        <section className="flex flex-col gap-3 rounded-2xl bg-bg-base p-4" aria-labelledby="glance-title">
            <h2 id="glance-title" className="text-sm font-semibold text-text-muted">At a glance</h2>

            <StartingBalanceCard />

            {snapshot && (
                <div className="rounded-xl bg-linear-to-br from-accent/30 to-accent/5 p-4" aria-live="polite">
                    <div className="flex items-baseline justify-between gap-2 border-b border-white/10 pb-3">
                        <p className="text-xs font-medium text-white/80">Current balance</p>
                        <p className={`text-lg font-semibold tabular-nums ${snapshot.currentBalance < 0 ? "text-expense" : "text-white"}`}>{signed(snapshot.currentBalance)}</p>
                    </div>

                    <p className="mt-3 text-xs font-medium text-white/80">
                        {nextIncome ? "Spending power until your next income" : "Spending power this week"}
                    </p>
                    <p className={`mt-1 text-3xl font-bold tabular-nums ${snapshot.spendingPower < 0 ? "text-expense" : "text-white"}`}>{signed(snapshot.spendingPower)}</p>
                    <p className="mt-1 text-xs text-white/70">
                        {snapshot.dueBeforeIncome > 0
                            ? `Current balance minus ${formatCurrency(snapshot.dueBeforeIncome)} still due through ${formatShortDate(snapshot.through)}`
                            : `Nothing else due through ${formatShortDate(snapshot.through)}`}
                    </p>
                    <p className={`mt-2 text-xs ${isIncomeLate ? "text-bill" : "text-white/70"}`}>
                        {nextIncome
                            ? `${isIncomeLate ? "Late: " : "Next: "}${nextIncome.transaction.title} +${formatCurrency(nextIncome.transaction.amount)} ${isIncomeLate ? "was due" : "on"} ${formatShortDate(nextIncome.expectedDate)}`
                            : "No income scheduled in the next two months."}
                    </p>
                </div>
            )}

            <h3 className="mt-1 text-xs font-semibold tracking-wide text-text-muted uppercase">{formatMonth(month)} by week</h3>
            <ul className="flex flex-col gap-2">
                {weeks.map(week => (
                    <WeekCard key={week.start} week={week} isCurrent={today >= week.start && today <= week.end} />
                ))}
            </ul>
            <p className="text-[0.7rem] text-text-muted">Each week's leftover (or shortfall) carries into the next week.</p>
        </section>
    );
};

export default WeeklyGlance;
