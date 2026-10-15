import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";

export default function Calendar() {
    const [selectedDay, setSelectedDay] = useState<string>(
        new Date().toISOString().split("T")[0]
    );

    const events = [
        { title: "Rent $1200", date: "2026-06-01", color: "#EF4444" },
        { title: "Salary $3000", date: "2026-06-15", color: "#22C55E" },
        { title: "Netflix $15", date: "2026-06-20", color: "#8B5CF6" },
    ];

    const handleDayClick = (info: { dateStr: string }) => {
        setSelectedDay(info.dateStr);
    };

    return (
        <section className="calendar">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                initialDate={new Date()}
                height="100%"
                selectable={true}
                dateClick={handleDayClick}
                dayCellClassNames={(arg) =>
                    arg.dateStr === selectedDay ? "selected-day" : "hover-day"
                }
                events={events}
            />
        </section>
    );
}