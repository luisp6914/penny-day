import { useMemo, useState } from "react";
import BudgetSummaryCards from "../components/budget/BudgetSummaryCards";
import CategoryBreakdown from "../components/budget/CategoryBreakdown";
import MonthSwitcher from "../components/budget/MonthSwitcher";
import OccurrenceItem from "../components/transactions/OccurrenceItem";
import { useOccurrences } from "../hooks/useTransactions";
import { getOutflowBreakdown, summarizeBudget } from "../utils/budget";
import { monthBounds, monthOf, todayKey } from "../utils/date";

const BudgetPage = () => {
    const [month, setMonth] = useState(() => monthOf(todayKey()));
    const { start, end } = monthBounds(month);
    const occurrences = useOccurrences(start, end);

    const summary = useMemo(() => summarizeBudget(occurrences), [occurrences]);
    const categoryTotals = useMemo(() => getOutflowBreakdown(occurrences), [occurrences]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <MonthSwitcher month={month} onChange={setMonth} />
                <p className="text-xs text-text-muted">Remaining = Income − Spent − Saved</p>
            </div>

            <BudgetSummaryCards summary={summary} />

            <div className="grid gap-4 lg:grid-cols-2">
                <CategoryBreakdown totals={categoryTotals} totalIncome={summary.totalIncome} />

                <section className="rounded-xl bg-bg-base p-4" aria-labelledby="month-transactions-title">
                    <h2 id="month-transactions-title" className="mb-4 text-lg font-semibold text-white">Transactions this month</h2>
                    {occurrences.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-border-subtle px-4 py-6 text-center text-sm text-text-muted">
                            Nothing scheduled this month. Use “Add Transaction” to get started.
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {occurrences.map(o => <OccurrenceItem key={o.key} occurrence={o} showDate />)}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
};

export default BudgetPage;
