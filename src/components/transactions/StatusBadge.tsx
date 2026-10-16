import type { OccurrenceStatus, StatusTone } from "../../utils/status";

const TONE_CLASSES: Record<StatusTone, string> = {
    pending: "bg-white/10 text-text-muted",
    success: "bg-income/15 text-income",
    warning: "bg-bill/15 text-bill",
    danger: "bg-expense/15 text-expense",
};

const StatusBadge = ({ status }: { status: OccurrenceStatus }) => (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[0.7rem] font-medium whitespace-nowrap ${TONE_CLASSES[status.tone]}`}>
        {status.label}
    </span>
);

export default StatusBadge;
