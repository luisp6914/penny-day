import { Icon } from "@iconify/react";
import { useState } from "react";
import { useDebts, useTransactions } from "../../hooks/useTransactions";
import type { Debt } from "../../types/debt";
import { formatFullDate, todayKey } from "../../utils/date";
import { formatDuration, payoffDate, simulateDebt } from "../../utils/loans";
import { formatCurrency } from "../../utils/money";
import DebtFormModal from "../modals/DebtFormModal";
import { iconButtonClass, inputClass } from "../ui/styles";

const KIND_ICONS: Record<Debt["kind"], string> = {
    "Car loan": "mdi:car-outline",
    "Student loan": "mdi:school-outline",
    "Personal loan": "mdi:account-cash-outline",
    "Mortgage": "mdi:home-outline",
    "Credit card": "mdi:credit-card-outline",
};

const Stat = ({ label, value, className = "text-white" }: { label: string; value: string; className?: string }) => (
    <div>
        <dt className="text-xs text-text-muted">{label}</dt>
        <dd className={`font-semibold tabular-nums ${className}`}>{value}</dd>
    </div>
);

const DebtCard = ({ debt }: { debt: Debt }) => {
    const { deleteDebt } = useDebts();
    const { deleteTransaction } = useTransactions();
    const [isEditing, setIsEditing] = useState(false);
    const [extra, setExtra] = useState("");

    const result = simulateDebt(debt);
    const extraNum = Math.max(Number(extra) || 0, 0);
    const withExtra = extraNum > 0 ? simulateDebt(debt, extraNum) : null;
    const promoEnd = debt.promoMonths ? payoffDate(debt.firstPaymentDate, debt.promoMonths) : null;
    const isPromoActive = promoEnd !== null && promoEnd >= todayKey();
    const interestShare = result.paysOff && result.totalPaid ? (result.totalInterest / result.totalPaid) * 100 : 0;

    const handleDelete = () => {
        const message = debt.transactionId
            ? `Delete “${debt.name}” and its monthly payment from your calendar?`
            : `Delete “${debt.name}”?`;
        if (!window.confirm(message)) return;
        if (debt.transactionId) deleteTransaction(debt.transactionId);
        deleteDebt(debt.id);
    };

    return (
        <li className="flex flex-col gap-4 rounded-xl bg-bg-base p-4">
            <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-hover">
                    <Icon icon={KIND_ICONS[debt.kind]} width={22} height={22} />
                </span>
                <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-white">{debt.name}</h3>
                    <p className="text-xs text-text-muted">{debt.kind} · {debt.apr}% APR · {formatCurrency(debt.balance)} owed</p>
                    {promoEnd && (
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[0.7rem] font-semibold ${isPromoActive ? "bg-income/15 text-income" : "bg-white/10 text-text-muted"}`}>
                            0% APR {isPromoActive ? "until" : "ended"} {formatFullDate(promoEnd)}
                        </span>
                    )}
                </div>
                <button type="button" className={iconButtonClass} aria-label={`Edit ${debt.name}`} title="Edit" onClick={() => setIsEditing(true)}>
                    <Icon icon="mdi:pencil-outline" width={18} height={18} />
                </button>
                <button type="button" className={`${iconButtonClass} hover:text-expense`} aria-label={`Delete ${debt.name}`} title="Delete" onClick={handleDelete}>
                    <Icon icon="mdi:trash-can-outline" width={18} height={18} />
                </button>
            </div>

            {result.paysOff ? (
                <>
                    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <Stat label="Monthly payment" value={formatCurrency(debt.monthlyPayment)} />
                        <Stat label="Interest you'll pay" value={formatCurrency(result.totalInterest)} className="text-expense" />
                        <Stat label="Total cost" value={formatCurrency(result.totalPaid)} />
                        <div>
                            <dt className="text-xs text-text-muted">Paid off</dt>
                            <dd className="font-semibold text-white">{formatFullDate(payoffDate(debt.firstPaymentDate, result.months))}</dd>
                            <dd className="text-xs text-text-muted">{formatDuration(result.months)}</dd>
                        </div>
                    </dl>

                    {promoEnd && (
                        <p className={`rounded-lg p-3 text-sm ${result.balanceAfterPromo > 0 ? "bg-bill/10 text-bill" : "bg-income/10 text-income"}`}>
                            {result.balanceAfterPromo > 0
                                ? `${formatCurrency(result.balanceAfterPromo)} will still be owed when the 0% ends, then it's charged ${debt.apr}% APR.`
                                : "Paid off before the 0% promo ends, so you won't pay any interest."}
                        </p>
                    )}

                    <div>
                        <div className="flex h-2.5 overflow-hidden rounded-full bg-bg-surface-alt" aria-hidden>
                            <div className="h-full bg-accent" style={{ width: `${100 - interestShare}%` }} />
                            <div className="h-full bg-expense" style={{ width: `${interestShare}%` }} />
                        </div>
                        <p className="mt-1.5 flex justify-between text-xs text-text-muted">
                            <span><span className="text-accent-hover">■</span> Principal {Math.round(100 - interestShare)}%</span>
                            <span><span className="text-expense">■</span> Interest {Math.round(interestShare)}%</span>
                        </p>
                    </div>

                    <div className="rounded-lg bg-white/5 p-3">
                        <label htmlFor={`extra-${debt.id}`} className="text-xs font-semibold text-white">What if I paid extra each month?</label>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                            <div className="relative w-32">
                                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-text-muted">$</span>
                                <input id={`extra-${debt.id}`} type="number" inputMode="decimal" min={0} step="10" placeholder="0" className={`${inputClass} no-spinner py-1.5 pl-6`} value={extra} onChange={(e) => setExtra(e.target.value)} onWheel={(e) => e.currentTarget.blur()} />
                            </div>
                            {withExtra?.paysOff ? (
                                <p className="text-sm text-white">
                                    Save <span className="font-semibold text-income">{formatCurrency(result.totalInterest - withExtra.totalInterest)}</span> in interest,
                                    paid off <span className="font-semibold text-income">{formatDuration(result.months - withExtra.months)}</span> sooner.
                                </p>
                            ) : (
                                <p className="text-xs text-text-muted">Enter an amount to see the interest you'd save.</p>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <p className="rounded-lg bg-expense/10 p-3 text-sm text-expense">
                    The {formatCurrency(debt.monthlyPayment)} payment doesn't cover the {formatCurrency(result.interestAtFullRate)} of monthly interest{debt.promoMonths ? " once the promo ends" : ""}, so this balance will keep growing. Edit it to raise the payment.
                </p>
            )}

            <DebtFormModal isOpen={isEditing} onOpenChange={setIsEditing} debt={debt} />
        </li>
    );
};

export default DebtCard;
