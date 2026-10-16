import { useMemo } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import { formatMonth, formatRange, formatShortDate, monthBounds, todayKey, type MonthRef } from "../../utils/date";
import { formatCurrency } from "../../utils/money";
import { getSafeToSpend, getWeeklySummaries, type WeekSummary } from "../../utils/weekly";

const signed = (n: number) => `${n < 0 ? "−" : ""}${formatCurrency(Math.abs(n))}`;

const Row = ({ label, value, className = "" }: { label: string; value: string; className?: string }) => (
    <div className="flex items-baseline justify-between gap-2">
        <dt className="text-text-muted">{label}</dt>
        <dd className={`tabular-nums ${className}`}>{value}</dd>
    </div>
);

const WeekCard = ({ week, isCurrent }: { week: WeekSummary; isCurrent: boolean }) => (
    <li className={`rounded-lg border p-3 ${isCurrent ? "border-accent/60 bg-accent/[0.07]" : "border-border-subtle bg-bg-surface"}`}>
        <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-white">{formatRange(week.start, week.end)}</p>
            {isCurrent && <span className="rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-semibold text-white uppercase">This week</span>}
        </div>
        <dl className="grid gap-1 text-xs">
            <Row label="Carried over" value={signed(week.carriedOver)} className={week.carriedOver < 0 ? "text-expense" : "text-white"} />
            <Row label="Income" value={`+${formatCurrency(week.income)}`} className="text-income" />
            <Row label="Incoming expenses" value={`−${formatCurrency(week.expenses)}`} className="text-expense" />
            {week.savings > 0 && <Row label="Savings" value={`−${formatCurrency(week.savings)}`} className="text-savings" />}
        </dl>
        <div className="mt-2 flex items-baseline justify-between border-t border-border-subtle pt-2">
            <span className="text-xs text-text-muted">Left for next week</span>
            <span className={`font-semibold tabular-nums ${week.remaining < 0 ? "text-expense" : "text-white"}`}>{signed(week.remaining)}</span>
        </div>
    </li>
);

const WeeklyGlance = ({ month }: { month: MonthRef }) => {
    const { transactions } = useTransactions();
    const today = todayKey();

    const weeks = useMemo(() => {
        const { start, end } = monthBounds(month);
        return getWeeklySummaries(transactions, start, end);
    }, [transactions, month]);

    const safe = useMemo(() => getSafeToSpend(transactions, today), [transactions, today]);

    return (
        <section className="flex flex-col gap-3 rounded-2xl bg-bg-base p-4" aria-labelledby="glance-title">
            <h2 id="glance-title" className="text-sm font-semibold text-text-muted">At a glance</h2>

            <div className="rounded-xl bg-linear-to-br from-accent/30 to-accent/5 p-4">
                <p className="text-xs font-medium text-white/80">
                    {safe.nextIncome ? "Left to spend until your next income" : "Left to spend this week"}
                </p>
                <p className={`mt-1 text-3xl font-bold tabular-nums ${safe.amount < 0 ? "text-expense" : "text-white"}`}>{signed(safe.amount)}</p>
                <p className="mt-1 text-xs text-white/70">
                    {safe.nextIncome
                        ? `Next: ${safe.nextIncome.transaction.title} +${formatCurrency(safe.nextIncome.transaction.amount)} on ${formatShortDate(safe.nextIncome.expectedDate)}`
                        : "No income scheduled in the next two months."}
                </p>
            </div>

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
