import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import DebtCard from "../components/loans/DebtCard";
import DebtFormModal from "../components/modals/DebtFormModal";
import { primaryButtonClass } from "../components/ui/styles";
import { useDebts } from "../hooks/useTransactions";
import { simulateDebt } from "../utils/loans";
import { formatCurrency } from "../utils/money";

const LoansPage = () => {
    const { debts } = useDebts();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const totals = useMemo(() => debts.reduce((acc, debt) => {
        const result = simulateDebt(debt);
        return {
            owed: acc.owed + debt.balance,
            monthly: acc.monthly + debt.monthlyPayment,
            interest: acc.interest + (result.paysOff ? result.totalInterest : 0),
        };
    }, { owed: 0, monthly: 0, interest: 0 }), [debts]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">Loans & Credit</h1>
                    <p className="text-sm text-text-muted">See what your debt really costs in interest, and how to pay it off faster.</p>
                </div>
                <button type="button" className={primaryButtonClass} onClick={() => setIsModalOpen(true)}>
                    <Icon icon="mdi:add" width={18} height={18} />
                    Add loan or card
                </button>
            </div>

            {debts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border-subtle px-6 py-12 text-center">
                    <Icon icon="mdi:calculator-variant-outline" width={40} height={40} className="mx-auto text-text-muted" />
                    <p className="mt-3 font-medium text-white">No loans or credit cards yet</p>
                    <p className="mx-auto mt-1 max-w-md text-sm text-text-muted">
                        Add a car loan, student loan, mortgage or credit card with its APR to see your monthly payment, total interest and payoff date.
                    </p>
                </div>
            ) : (
                <>
                    <dl className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                        <div className="rounded-lg border border-border-subtle bg-bg-base p-4">
                            <dt className="text-xs text-text-muted">Total owed</dt>
                            <dd className="mt-1 text-2xl font-semibold text-white tabular-nums">{formatCurrency(totals.owed)}</dd>
                        </div>
                        <div className="rounded-lg border border-border-subtle bg-bg-base p-4">
                            <dt className="text-xs text-text-muted">Monthly payments</dt>
                            <dd className="mt-1 text-2xl font-semibold text-bill tabular-nums">{formatCurrency(totals.monthly)}</dd>
                        </div>
                        <div className="rounded-lg border border-border-subtle bg-bg-base p-4">
                            <dt className="text-xs text-text-muted">Interest still to pay</dt>
                            <dd className="mt-1 text-2xl font-semibold text-expense tabular-nums">{formatCurrency(totals.interest)}</dd>
                        </div>
                    </dl>

                    <ul className="grid gap-4 xl:grid-cols-2">
                        {debts.map(debt => <DebtCard key={debt.id} debt={debt} />)}
                    </ul>
                </>
            )}

            <DebtFormModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
        </div>
    );
};

export default LoansPage;
