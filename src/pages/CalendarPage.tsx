import { useState } from "react";
import MonthGrid from "../components/calendar/MonthGrid";
import WeeklyGlance from "../components/calendar/WeeklyGlance";
import { monthOf, todayKey } from "../utils/date";

const CalendarPage = () => {
    const [month, setMonth] = useState(() => monthOf(todayKey()));
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    return (
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
            <MonthGrid month={month} onMonthChange={setMonth} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            <WeeklyGlance month={month} />
        </div>
    );
};

export default CalendarPage;
