import { useState } from "react";
import { CREDIT_CARD_CATEGORY_ID, LOAN_CATEGORY_ID } from "../../constants/defaultCategories";
import { useDebts, useTransactions } from "../../hooks/useTransactions";
import type { Debt, DebtKind, NewDebt } from "../../types/debt";
import type { NewTransaction } from "../../types/transaction";
import { formatFullDate, parseDateKey, todayKey } from "../../utils/date";
import { amortizedPayment, formatDuration, payoffDate, payoffWithinPromo, simulatePayoff } from "../../utils/loans";
import { formatCurrency } from "../../utils/money";
import FloatingInput from "../ui/FloatingInput";
import { inputClass, labelClass } from "../ui/styles";

const DEBT_KINDS: readonly DebtKind[] = ["Car loan", "Student loan", "Personal loan", "Mortgage", "Credit card"];

interface DebtFormProps {
    formId: string;
    debt?: Debt; //edit this one instead of adding
    onSaved: () => void;
}

//The monthly bill a debt puts on the calendar, ending on its payoff date.
function buildPaymentBill(debt: NewDebt, lastPaymentDate: string): NewTransaction {
    return {
        title: `${debt.name} payment`,
        amount: debt.monthlyPayment,
        type: "Bill",
        categoryId: debt.kind === "Credit card" ? CREDIT_CARD_CATEGORY_ID : LOAN_CATEGORY_ID,
        date: debt.firstPaymentDate,
        recurrence: {
            frequency: "Monthly",
            anchors: [{ anchor: "DayOfMonth", dayOfMonth: parseDateKey(debt.firstPaymentDate).getDate() }],
            endDate: lastPaymentDate,
        },
        notes: `${debt.kind} · ${debt.promoMonths ? `0% for ${debt.promoMonths} mo, then ` : ""}${debt.apr}% APR`,
    };
}

const DebtForm = ({ formId, debt, onSaved }: DebtFormProps) => {
    const { addDebt, updateDebt } = useDebts();
    const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
    const linkedBillExists = Boolean(debt?.transactionId && transactions.some(t => t.id === debt.transactionId));

    const [name, setName] = useState(debt?.name ?? "");
    const [kind, setKind] = useState<DebtKind>(debt?.kind ?? "Car loan");
    const [balance, setBalance] = useState(debt ? String(debt.balance) : "");
    const [apr, setApr] = useState(debt ? String(debt.apr) : "");
    const [termMonths, setTermMonths] = useState(debt?.termMonths ? String(debt.termMonths) : "60");
    const [cardPayment, setCardPayment] = useState(debt && debt.kind === "Credit card" ? String(debt.monthlyPayment) : "");
    const [firstPaymentDate, setFirstPaymentDate] = useState(debt?.firstPaymentDate ?? todayKey());
    const [hasPromo, setHasPromo] = useState(Boolean(debt?.promoMonths));
    const [promoMonths, setPromoMonths] = useState(debt?.promoMonths ? String(debt.promoMonths) : "12");
    const [addToCalendar, setAddToCalendar] = useState(debt ? linkedBillExists : true);
    const [error, setError] = useState<string | null>(null);

    const isCard = kind === "Credit card";
    const balanceNum = Number(balance);
    const aprNum = Number(apr);
    const termNum = Math.round(Number(termMonths));
    const promoNum = hasPromo ? Math.round(Number(promoMonths)) : 0;
    const promoValid = !hasPromo || (promoNum > 0 && promoNum <= 60 && (isCard || promoNum <= termNum));
    const monthlyPayment = isCard ? Number(cardPayment) : amortizedPayment(balanceNum, aprNum, termNum, promoNum);

    const inputsValid = balanceNum > 0 && aprNum >= 0 && apr !== "" && monthlyPayment > 0 && (isCard || termNum > 0) && promoValid;
    const preview = inputsValid ? simulatePayoff(balanceNum, aprNum, monthlyPayment, promoNum) : null;
    const promoPayoffPayment = payoffWithinPromo(balanceNum, promoNum);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name.trim()) return setError("Give it a name, like “Honda Civic” or “Chase Visa”.");
        if (!(balanceNum > 0)) return setError("Enter how much you still owe.");
        if (apr === "" || !(aprNum >= 0) || aprNum > 100) return setError("Enter the APR as a percent between 0 and 100.");
        if (!isCard && !(termNum > 0 && termNum <= 480)) return setError("Enter a term between 1 and 480 months.");
        if (isCard && !(monthlyPayment > 0)) return setError("Enter how much you'll pay each month.");
        if (hasPromo && !promoValid) {
            return setError(isCard ? "Enter a promo length between 1 and 60 months." : "The promo can't be longer than the loan (or 60 months).");
        }
        if (!firstPaymentDate) return setError("Pick the date of your next payment.");
        if (!preview?.paysOff) {
            return setError(`That payment doesn't cover the ${formatCurrency(preview?.interestAtFullRate ?? 0)} of monthly interest${hasPromo ? " once the promo ends" : ""}, so the balance would never go down.`);
        }

        const input: NewDebt = {
            name: name.trim(),
            kind,
            balance: Math.round(balanceNum * 100) / 100,
            apr: aprNum,
            termMonths: isCard ? undefined : termNum,
            monthlyPayment: Math.round(monthlyPayment * 100) / 100,
            promoMonths: promoNum || undefined,
            firstPaymentDate,
        };

        //Keep the calendar bill in step with the debt.
        const bill = buildPaymentBill(input, payoffDate(firstPaymentDate, preview.months));
        let transactionId = linkedBillExists ? debt?.transactionId : undefined;
        if (addToCalendar && transactionId) updateTransaction(transactionId, bill);
        else if (addToCalendar) transactionId = addTransaction(bill);
        else if (transactionId) {
            deleteTransaction(transactionId);
            transactionId = undefined;
        }

        if (debt) updateDebt(debt.id, { ...input, transactionId });
        else addDebt({ ...input, transactionId });
        onSaved();
    };

    return (
        <form id={formId} className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
            <FloatingInput id="debt-name" label="Name" type="text" autoComplete="off" maxLength={40} value={name} onChange={(e) => setName(e.target.value)} />

            <div>
                <label htmlFor="debt-kind" className={labelClass}>Type</label>
                <select id="debt-kind" className={inputClass} value={kind} onChange={(e) => setKind(e.target.value as DebtKind)}>
                    {DEBT_KINDS.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <FloatingInput id="debt-balance" label={isCard ? "Card balance ($)" : "Amount owed ($)"} className="no-spinner" type="number" inputMode="decimal" min={0} step="0.01" value={balance} onChange={(e) => setBalance(e.target.value)} onWheel={(e) => e.currentTarget.blur()} />
                <FloatingInput id="debt-apr" label="APR (%)" className="no-spinner" type="number" inputMode="decimal" min={0} max={100} step="0.01" value={apr} onChange={(e) => setApr(e.target.value)} onWheel={(e) => e.currentTarget.blur()} />
            </div>

            {isCard ? (
                <FloatingInput id="debt-payment" label="Monthly payment ($)" className="no-spinner" type="number" inputMode="decimal" min={0} step="0.01" value={cardPayment} onChange={(e) => setCardPayment(e.target.value)} onWheel={(e) => e.currentTarget.blur()} />
            ) : (
                <div>
                    <label htmlFor="debt-term" className={labelClass}>Months left on the loan</label>
                    <input id="debt-term" type="number" inputMode="numeric" min={1} max={480} className={`${inputClass} no-spinner`} value={termMonths} onChange={(e) => setTermMonths(e.target.value)} onWheel={(e) => e.currentTarget.blur()} />
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {[36, 48, 60, 72, 120, 360].map(m => (
                            <button key={m} type="button" onClick={() => setTermMonths(String(m))} className={`cursor-pointer rounded-full border px-2.5 py-0.5 text-xs transition-colors ${termNum === m ? "border-accent bg-accent text-white" : "border-border-subtle text-text-muted hover:text-white"}`}>
                                {m >= 120 ? `${m / 12} yrs` : `${m} mo`}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <label htmlFor="debt-first-payment" className={labelClass}>Next payment date</label>
                <input id="debt-first-payment" type="date" className={inputClass} value={firstPaymentDate} onChange={(e) => setFirstPaymentDate(e.target.value)} />
            </div>

            <div className="rounded-lg border border-border-subtle p-3">
                <label className="flex cursor-pointer items-center gap-3 text-sm text-white">
                    <input type="checkbox" className="h-4 w-4 accent-accent" checked={hasPromo} onChange={(e) => setHasPromo(e.target.checked)} />
                    <span>Has a 0% APR promo period</span>
                </label>

                {hasPromo && (
                    <div className="mt-3 flex flex-col gap-2">
                        <label htmlFor="debt-promo" className="text-xs font-semibold text-white">Months at 0% (from the next payment)</label>
                        <input id="debt-promo" type="number" inputMode="numeric" min={1} max={60} className={`${inputClass} no-spinner`} value={promoMonths} onChange={(e) => setPromoMonths(e.target.value)} onWheel={(e) => e.currentTarget.blur()} />
                        <div className="flex flex-wrap gap-1.5">
                            {[6, 12, 15, 18, 21].map(m => (
                                <button key={m} type="button" onClick={() => setPromoMonths(String(m))} className={`cursor-pointer rounded-full border px-2.5 py-0.5 text-xs transition-colors ${promoNum === m ? "border-accent bg-accent text-white" : "border-border-subtle text-text-muted hover:text-white"}`}>
                                    {m} mo
                                </button>
                            ))}
                        </div>
                        {promoValid && firstPaymentDate && (
                            <p className="text-xs text-text-muted">
                                0% through {formatFullDate(payoffDate(firstPaymentDate, promoNum))}, then {apr || "0"}% APR on what's left.
                            </p>
                        )}
                        {isCard && promoValid && balanceNum > 0 && (
                            <p className="text-xs text-text-muted">
                                Pay <span className="font-semibold text-white">{formatCurrency(promoPayoffPayment)}/mo</span> to clear it before the promo ends.{" "}
                                <button type="button" className="cursor-pointer font-medium text-accent-hover underline-offset-2 hover:underline" onClick={() => setCardPayment(String(promoPayoffPayment))}>Use this</button>
                            </p>
                        )}
                    </div>
                )}
            </div>

            {preview && (
                <div className="rounded-lg bg-white/5 p-3 text-sm" aria-live="polite">
                    {preview.paysOff ? (
                        <dl className="grid grid-cols-2 gap-x-3 gap-y-2">
                            <div><dt className="text-xs text-text-muted">Monthly payment</dt><dd className="font-semibold text-white tabular-nums">{formatCurrency(monthlyPayment)}</dd></div>
                            <div><dt className="text-xs text-text-muted">Paid off</dt><dd className="font-semibold text-white">{formatFullDate(payoffDate(firstPaymentDate || todayKey(), preview.months))} <span className="text-xs font-normal text-text-muted">({formatDuration(preview.months)})</span></dd></div>
                            <div><dt className="text-xs text-text-muted">Total interest</dt><dd className="font-semibold text-expense tabular-nums">{formatCurrency(preview.totalInterest)}</dd></div>
                            <div><dt className="text-xs text-text-muted">Total you'll pay</dt><dd className="font-semibold text-white tabular-nums">{formatCurrency(preview.totalPaid)}</dd></div>
                            {promoNum > 0 && (
                                <div className="col-span-2">
                                    <dt className="text-xs text-text-muted">Still owed when the 0% ends</dt>
                                    <dd className={`font-semibold tabular-nums ${preview.balanceAfterPromo > 0 ? "text-bill" : "text-income"}`}>
                                        {preview.balanceAfterPromo > 0 ? formatCurrency(preview.balanceAfterPromo) : "Nothing, paid off during the promo"}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    ) : (
                        <p className="text-expense">This payment doesn't cover the {formatCurrency(preview.interestAtFullRate)} of monthly interest{promoNum > 0 ? " once the promo ends" : ""}, so the balance would never go down.</p>
                    )}
                </div>
            )}

            <label className="flex cursor-pointer items-start gap-3 text-sm text-white">
                <input type="checkbox" className="mt-0.5 h-4 w-4 accent-accent" checked={addToCalendar} onChange={(e) => setAddToCalendar(e.target.checked)} />
                <span>
                    Add the monthly payment to my calendar
                    <span className="block text-xs text-text-muted">Shows as a bill every month until it's paid off.</span>
                </span>
            </label>

            {error && <p role="alert" className="rounded bg-expense/10 px-3 py-2 text-sm text-expense">{error}</p>}
        </form>
    );
};

export default DebtForm;
