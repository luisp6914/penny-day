import { COMPLETED_LABEL } from "../constants/transactionTypes";
import type { Occurrence } from "../types/transaction";
import { todayKey } from "./date";

export type StatusTone = "pending" | "success" | "warning" | "danger";

export interface OccurrenceStatus {
    label: string;
    tone: StatusTone;
}

//Status is derived from expected vs actual dates, so "early"/"late" never has to be picked by hand.
export function getOccurrenceStatus(occurrence: Occurrence, today: string = todayKey()): OccurrenceStatus {
    const { type } = occurrence.transaction;
    const done = COMPLETED_LABEL[type];

    if (occurrence.actualDate) {
        if (occurrence.actualDate < occurrence.expectedDate) return { label: `${done} early`, tone: "success" };
        if (occurrence.actualDate > occurrence.expectedDate) return { label: `${done} late`, tone: "warning" };
        return { label: done, tone: "success" };
    }

    if (occurrence.expectedDate < today) {
        return type === "Income" ? { label: "Late", tone: "warning" } : { label: "Overdue", tone: "danger" };
    }
    return { label: type === "Income" ? "Expected" : "Upcoming", tone: "pending" };
}
