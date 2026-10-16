import { TYPE_COLORS } from "../../constants/transactionTypes";
import type { Occurrence } from "../../types/transaction";
import { formatLongDate, parseDateKey } from "../../utils/date";
import { formatCurrency } from "../../utils/money";

const MAX_DOTS = 4;
const MAX_PILLS = 3;

interface DayCellProps {
    date: string;
    occurrences: Occurrence[];
    isToday: boolean;
    isSelected: boolean;
    isOutsideMonth: boolean;
    onClick: () => void;
}

const DayCell = ({ date, occurrences, isToday, isSelected, isOutsideMonth, onClick }: DayCellProps) => {
    const count = occurrences.length;
    const label = `${formatLongDate(date)}${count ? `, ${count} transaction${count > 1 ? "s" : ""}` : ""}`;

    const numberClass = isToday
        ? "bg-accent text-white"
        : isSelected
            ? "bg-white text-bg-surface"
            : isOutsideMonth ? "text-text-muted/50" : "text-white";

    return (
        <button
            type="button"
            aria-label={label}
            aria-expanded={isSelected}
            onClick={onClick}
            className={`group flex h-16 min-w-0 cursor-pointer flex-col items-center gap-1 px-0.5 pt-1.5 transition-colors outline-none focus-visible:bg-white/10 sm:h-24 sm:items-stretch sm:px-1 md:h-28 ${isSelected ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"}`}
        >
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center self-center rounded-full text-sm font-semibold tabular-nums sm:self-end ${numberClass}`}>
                {parseDateKey(date).getDate()}
            </span>

            {/* Phones: colored dots, like a calendar app */}
            {count > 0 && (
                <span className="flex items-center gap-0.5 sm:hidden" aria-hidden>
                    {occurrences.slice(0, MAX_DOTS).map(o => (
                        <span key={o.key} className={`h-1.5 w-1.5 rounded-full ${o.actualDate ? "opacity-40" : ""}`} style={{ backgroundColor: TYPE_COLORS[o.transaction.type] }} />
                    ))}
                </span>
            )}

            {/* Tablets and up: labeled pills */}
            {count > 0 && (
                <span className="hidden w-full min-w-0 flex-col gap-0.5 sm:flex" aria-hidden>
                    {occurrences.slice(0, MAX_PILLS).map(o => {
                        const color = TYPE_COLORS[o.transaction.type];
                        return (
                            <span
                                key={o.key}
                                className={`flex min-w-0 items-center gap-1 rounded border-l-2 px-1 py-px text-left text-[11px] leading-tight ${o.actualDate ? "opacity-50" : ""}`}
                                style={{ borderColor: color, backgroundColor: `${color}22`, color }}
                            >
                                <span className="min-w-0 truncate font-medium">{o.actualDate ? "✓ " : ""}{o.transaction.title}</span>
                                <span className="ml-auto hidden shrink-0 tabular-nums lg:inline">{formatCurrency(o.transaction.amount).replace(/\.00$/, "")}</span>
                            </span>
                        );
                    })}
                    {count > MAX_PILLS && <span className="px-1 text-left text-[11px] text-text-muted">+{count - MAX_PILLS} more</span>}
                </span>
            )}
        </button>
    );
};

export default DayCell;
