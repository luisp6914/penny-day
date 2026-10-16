import type { CategoryTotal } from "../../utils/budget";
import { formatCurrency } from "../../utils/money";

interface CategoryBreakdownProps {
    totals: CategoryTotal[];
    totalIncome: number;
}

//Spending and savings side by side, as a share of everything that went out this month.
const CategoryBreakdown = ({ totals, totalIncome }: CategoryBreakdownProps) => {
    const totalOut = totals.reduce((sum, t) => sum + t.total, 0);
    const totalSaved = totals.filter(t => t.type === "Savings").reduce((sum, t) => sum + t.total, 0);
    const savedShare = totalOut ? (totalSaved / totalOut) * 100 : 0;
    const savingsRate = totalIncome ? (totalSaved / totalIncome) * 100 : 0;

    return (
        <section className="rounded-xl bg-bg-base p-4" aria-labelledby="category-breakdown-title">
            <h2 id="category-breakdown-title" className="mb-1 text-lg font-semibold text-white">Where your money went</h2>
            <p className="mb-4 text-xs text-text-muted">Spending and savings this month, by category</p>

            {totals.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border-subtle px-4 py-6 text-center text-sm text-text-muted">
                    Nothing spent or saved this month yet.
                </p>
            ) : (
                <>
                    <div className="mb-4 grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-savings/10 p-3">
                            <p className="text-xs text-text-muted">Went to savings</p>
                            <p className="text-xl font-semibold text-savings tabular-nums">{Math.round(savedShare)}%</p>
                            <p className="text-[0.7rem] text-text-muted">of money out</p>
                        </div>
                        <div className="rounded-lg bg-white/5 p-3">
                            <p className="text-xs text-text-muted">Savings rate</p>
                            <p className="text-xl font-semibold text-white tabular-nums">{totalIncome ? `${Math.round(savingsRate)}%` : "—"}</p>
                            <p className="text-[0.7rem] text-text-muted">of income</p>
                        </div>
                    </div>

                    <ul className="flex flex-col gap-3">
                        {totals.map(({ category, type, total, count }) => {
                            const share = totalOut ? (total / totalOut) * 100 : 0;
                            return (
                                <li key={`${category.id}:${type}`}>
                                    <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                                        <span className="flex min-w-0 items-center gap-2 text-white">
                                            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: category.color }} aria-hidden />
                                            <span className="truncate">{category.name}</span>
                                            {type === "Savings" && <span className="rounded bg-savings/15 px-1.5 text-[0.65rem] font-semibold text-savings">SAVED</span>}
                                            <span className="text-xs text-text-muted">×{count}</span>
                                        </span>
                                        <span className="shrink-0 tabular-nums text-white">
                                            {formatCurrency(total)} <span className="text-xs text-text-muted">{Math.round(share)}%</span>
                                        </span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-bg-surface-alt">
                                        <div className="h-full rounded-full" style={{ width: `${share}%`, backgroundColor: category.color }} />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </section>
    );
};

export default CategoryBreakdown;
