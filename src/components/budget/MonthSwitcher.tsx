import { Icon } from "@iconify/react";
import { formatMonth, monthOf, shiftMonth, todayKey, type MonthRef } from "../../utils/date";
import { iconButtonClass, secondaryButtonClass } from "../ui/styles";

interface MonthSwitcherProps {
    month: MonthRef;
    onChange: (month: MonthRef) => void;
}

const MonthSwitcher = ({ month, onChange }: MonthSwitcherProps) => (
    <div className="flex items-center gap-2">
        <button type="button" className={iconButtonClass} aria-label="Previous month" onClick={() => onChange(shiftMonth(month, -1))}>
            <Icon icon="mdi:chevron-left" width={22} height={22} />
        </button>
        <h1 className="min-w-40 text-center text-xl font-semibold text-white">{formatMonth(month)}</h1>
        <button type="button" className={iconButtonClass} aria-label="Next month" onClick={() => onChange(shiftMonth(month, 1))}>
            <Icon icon="mdi:chevron-right" width={22} height={22} />
        </button>
        <button type="button" className={`${secondaryButtonClass} ml-1 px-2.5 py-1.5`} onClick={() => onChange(monthOf(todayKey()))}>
            This month
        </button>
    </div>
);

export default MonthSwitcher;
