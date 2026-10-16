import type { BudgetSummary } from "../../types/budgetSummary";
import { formatCurrency } from "../../utils/money";

const BudgetSummaryCards = ({ summary }: { summary: BudgetSummary }) => {
    const isNegative = summary.remainingBalance < 0;
    const cards = [
        { label: "Income", value: summary.totalIncome, color: "text-income" },
        { label: "Spent", value: summary.totalSpent, color: "text-expense" },
        { label: "Saved", value: summary.totalSaved, color: "text-savings" },
        { label: "Remaining", value: summary.remainingBalance, color: isNegative ? "text-expense" : "text-white" },
    ];

    return (
        <dl className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
            {cards.map(card => (
                <div key={card.label} className="rounded-lg border border-border-subtle bg-bg-base p-4">
                    <dt className="text-xs text-text-muted">{card.label}</dt>
                    <dd className={`mt-1 font-semibold tabular-nums ${card.color} text-xl sm:text-2xl`}>
                        {formatCurrency(card.value)}
                    </dd>
                </div>
            ))}
        </dl>
    );
};

export default BudgetSummaryCards;
