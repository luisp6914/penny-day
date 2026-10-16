import { Icon } from "@iconify/react";
import { useState } from "react";
import { getCategory } from "../../constants/defaultCategories";
import { COMPLETED_LABEL, TYPE_COLORS } from "../../constants/transactionTypes";
import { useTransactions } from "../../hooks/useTransactions";
import type { Occurrence } from "../../types/transaction";
import { formatShortDate, todayKey } from "../../utils/date";
import { formatCurrency } from "../../utils/money";
import { describeRecurrence } from "../../utils/recurrence";
import { getOccurrenceStatus } from "../../utils/status";
import TransactionFormModal from "../modals/TransactionFormModal";
import { iconButtonClass, inputClass, primaryButtonClass, secondaryButtonClass } from "../ui/styles";
import DeleteOccurrenceDialog from "./DeleteOccurrenceDialog";
import StatusBadge from "./StatusBadge";

interface OccurrenceItemProps {
    occurrence: Occurrence;
    showDate?: boolean;
}

const OccurrenceItem = ({ occurrence, showDate = false }: OccurrenceItemProps) => {
    const { completeOccurrence, reopenOccurrence } = useTransactions();
    const [isCompleting, setIsCompleting] = useState(false);
    const [actualDate, setActualDate] = useState(todayKey);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { transaction, expectedDate } = occurrence;
    const category = getCategory(transaction.categoryId);
    const status = getOccurrenceStatus(occurrence);
    const isIncome = transaction.type === "Income";
    const doneLabel = COMPLETED_LABEL[transaction.type];

    const details = [
        category.name,
        transaction.recurrence && describeRecurrence(transaction.recurrence),
        occurrence.actualDate && `${doneLabel} ${formatShortDate(occurrence.actualDate)}`,
    ].filter(Boolean);

    const handleConfirm = () => {
        if (!actualDate) return;
        completeOccurrence(transaction.id, expectedDate, actualDate);
        setIsCompleting(false);
    };

    return (
        <li className="rounded-lg border border-border-subtle bg-bg-surface p-3">
            <div className="flex items-start gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: TYPE_COLORS[transaction.type] }} aria-hidden />

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <p className={`truncate font-medium ${occurrence.actualDate ? "text-text-muted" : "text-white"}`}>{transaction.title}</p>
                        <p className={`shrink-0 font-semibold tabular-nums ${isIncome ? "text-income" : "text-white"}`}>
                            {isIncome ? "+" : "−"}{formatCurrency(transaction.amount)}
                        </p>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-muted">
                        <StatusBadge status={status} />
                        {showDate && <span>{formatShortDate(expectedDate)}</span>}
                        {details.map((detail, i) => <span key={i}>· {detail}</span>)}
                    </div>

                    {transaction.notes && <p className="mt-2 text-sm break-words text-text-muted">{transaction.notes}</p>}

                    {isCompleting ? (
                        <div className="mt-3 flex flex-wrap items-end gap-2">
                            <label className="flex flex-col gap-1 text-xs text-text-muted">
                                {doneLabel} on
                                <input type="date" className={`${inputClass} py-1.5`} value={actualDate} onChange={(e) => setActualDate(e.target.value)} />
                            </label>
                            <button type="button" className={`${primaryButtonClass} py-1.5`} onClick={handleConfirm} disabled={!actualDate}>Save</button>
                            <button type="button" className={`${secondaryButtonClass} py-1.5`} onClick={() => setIsCompleting(false)}>Cancel</button>
                        </div>
                    ) : (
                        <div className="mt-2 flex items-center gap-1">
                            {occurrence.actualDate ? (
                                <button type="button" className="cursor-pointer rounded px-2 py-1 text-xs text-text-muted hover:bg-white/5 hover:text-white" onClick={() => reopenOccurrence(transaction.id, expectedDate)}>
                                    Undo {doneLabel.toLowerCase()}
                                </button>
                            ) : (
                                <button type="button" className="inline-flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-xs font-medium text-accent-hover hover:bg-accent/10" onClick={() => { setActualDate(todayKey()); setIsCompleting(true); }}>
                                    <Icon icon="material-symbols:check" width={14} height={14} />
                                    Mark {doneLabel.toLowerCase()}
                                </button>
                            )}
                            <button type="button" className={`${iconButtonClass} ml-auto h-7 w-7`} aria-label={`Edit ${transaction.title}`} title="Edit" onClick={() => setIsEditing(true)}>
                                <Icon icon="mdi:pencil-outline" width={16} height={16} />
                            </button>
                            <button type="button" className={`${iconButtonClass} h-7 w-7 hover:text-expense`} aria-label={`Delete ${transaction.title}`} title="Delete" onClick={() => setIsDeleting(true)}>
                                <Icon icon="mdi:trash-can-outline" width={16} height={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <TransactionFormModal isOpen={isEditing} onOpenChange={setIsEditing} transaction={transaction} />
            <DeleteOccurrenceDialog occurrence={occurrence} isOpen={isDeleting} onOpenChange={setIsDeleting} />
        </li>
    );
};

export default OccurrenceItem;
