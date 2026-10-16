import { Icon } from "@iconify/react";
import { Fragment, useMemo, useRef } from "react";
import { useOccurrences } from "../../hooks/useTransactions";
import type { Occurrence } from "../../types/transaction";
import { formatMonth, getMonthWeeks, monthOf, shiftMonth, todayKey, type MonthRef } from "../../utils/date";
import { iconButtonClass, secondaryButtonClass } from "../ui/styles";
import DayCell from "./DayCell";
import DayPanel from "./DayPanel";

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SWIPE_THRESHOLD_PX = 60;

interface MonthGridProps {
    month: MonthRef;
    onMonthChange: (month: MonthRef) => void;
    selectedDate: string | null;
    onSelectDate: (date: string | null) => void;
}

const MonthGrid = ({ month, onMonthChange, selectedDate, onSelectDate }: MonthGridProps) => {
    const weeks = useMemo(() => getMonthWeeks(month), [month]);
    const occurrences = useOccurrences(weeks[0][0], weeks[weeks.length - 1][6]);
    const today = todayKey();
    const touchStartX = useRef<number | null>(null);

    const byDate = useMemo(() => {
        const map = new Map<string, Occurrence[]>();
        for (const o of occurrences) map.set(o.expectedDate, [...(map.get(o.expectedDate) ?? []), o]);
        return map;
    }, [occurrences]);

    const goToMonth = (next: MonthRef) => {
        onMonthChange(next);
        onSelectDate(null);
    };

    const goToToday = () => {
        onMonthChange(monthOf(today));
        onSelectDate(today);
    };

    //Swipe left/right on phones to change month, like a calendar app.
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) goToMonth(shiftMonth(month, deltaX < 0 ? 1 : -1));
    };

    return (
        <section className="overflow-hidden rounded-2xl bg-bg-base" aria-label="Calendar">
            <header className="flex items-center justify-between gap-2 px-4 pt-4 pb-3">
                <h1 className="text-xl font-bold text-white sm:text-2xl">{formatMonth(month)}</h1>
                <div className="flex items-center gap-1">
                    <button type="button" className={`${secondaryButtonClass} px-3 py-1.5`} onClick={goToToday}>Today</button>
                    <button type="button" className={iconButtonClass} aria-label="Previous month" onClick={() => goToMonth(shiftMonth(month, -1))}>
                        <Icon icon="mdi:chevron-left" width={24} height={24} />
                    </button>
                    <button type="button" className={iconButtonClass} aria-label="Next month" onClick={() => goToMonth(shiftMonth(month, 1))}>
                        <Icon icon="mdi:chevron-right" width={24} height={24} />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-7 px-1 pb-1 sm:px-2" aria-hidden>
                {WEEKDAY_SHORT.map(day => (
                    <div key={day} className="text-center text-[0.7rem] font-semibold tracking-wide text-text-muted uppercase">
                        <span className="sm:hidden">{day[0]}</span>
                        <span className="hidden sm:inline">{day}</span>
                    </div>
                ))}
            </div>

            <div
                onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                onTouchEnd={handleTouchEnd}
            >
                {weeks.map(week => {
                    const isExpanded = selectedDate !== null && week.includes(selectedDate);
                    return (
                        <Fragment key={week[0]}>
                            <div className="grid grid-cols-7 border-t border-border-subtle/70">
                                {week.map(date => (
                                    <DayCell
                                        key={date}
                                        date={date}
                                        occurrences={byDate.get(date) ?? []}
                                        isToday={date === today}
                                        isSelected={date === selectedDate}
                                        isOutsideMonth={monthOf(date).month !== month.month}
                                        onClick={() => onSelectDate(date === selectedDate ? null : date)}
                                    />
                                ))}
                            </div>
                            {isExpanded && (
                                <DayPanel date={selectedDate} occurrences={byDate.get(selectedDate) ?? []} onClose={() => onSelectDate(null)} />
                            )}
                        </Fragment>
                    );
                })}
            </div>
        </section>
    );
};

export default MonthGrid;
