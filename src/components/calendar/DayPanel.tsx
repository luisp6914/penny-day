import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import type { Occurrence } from "../../types/transaction";
import { formatLongDate, todayKey } from "../../utils/date";
import { formatCurrency } from "../../utils/money";
import { signedAmount } from "../../utils/recurrence";
import TransactionFormModal from "../modals/TransactionFormModal";
import OccurrenceItem from "../transactions/OccurrenceItem";
import { iconButtonClass, primaryButtonClass } from "../ui/styles";

interface DayPanelProps {
    date: string;
    occurrences: Occurrence[];
    onClose: () => void;
}

//The expanded day: opens right under its week row and lists that day's transactions.
const DayPanel = ({ date, occurrences, onClose }: DayPanelProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const net = occurrences.reduce((sum, o) => sum + signedAmount(o), 0);

    useEffect(() => {
        panelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, [date]);

    return (
        <div ref={panelRef} role="region" aria-label={`Transactions on ${formatLongDate(date)}`} className="animate-expand border-t border-border-subtle/70 bg-bg-surface/60 px-3 py-4 sm:px-4">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">{date === todayKey() ? "Today" : "Selected day"}</p>
                    <h2 className="truncate text-base font-semibold text-white sm:text-lg">{formatLongDate(date)}</h2>
                    {occurrences.length > 0 && (
                        <p className={`text-sm tabular-nums ${net >= 0 ? "text-income" : "text-expense"}`}>
                            Net {net >= 0 ? "+" : "−"}{formatCurrency(Math.abs(net))}
                        </p>
                    )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                    <button type="button" className={`${primaryButtonClass} px-2.5 py-1.5`} onClick={() => setIsModalOpen(true)}>
                        <Icon icon="mdi:add" width={18} height={18} />
                        Add
                    </button>
                    <button type="button" className={iconButtonClass} aria-label="Close day" onClick={onClose}>
                        <Icon icon="material-symbols:close-rounded" width={20} height={20} />
                    </button>
                </div>
            </div>

            {occurrences.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border-subtle px-4 py-5 text-center text-sm text-text-muted">
                    Nothing scheduled for this day.
                </p>
            ) : (
                <ul className="grid gap-2 lg:grid-cols-2">
                    {occurrences.map(o => <OccurrenceItem key={o.key} occurrence={o} />)}
                </ul>
            )}

            <TransactionFormModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} defaultDate={date} />
        </div>
    );
};

export default DayPanel;
