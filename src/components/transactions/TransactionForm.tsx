import { RadioGroup } from "radix-ui";
import { useState } from "react";
import { getCategoriesForType } from "../../constants/defaultCategories";
import { DEFAULT_CATEGORY_FOR_TYPE, TRANSACTION_TYPES } from "../../constants/transactionTypes";
import { useTransactions } from "../../hooks/useTransactions";
import type { MonthlyAnchorConfig, RecurrenceRule } from "../../types/recurrence";
import type { Transaction, TransactionType } from "../../types/transaction";
import { ordinal, parseDateKey, todayKey } from "../../utils/date";
import CategorySelect from "../ui/CategorySelect";
import FloatingInput from "../ui/FloatingInput";
import SegmentedControl from "../ui/SegmentedControl";
import { inputClass, labelClass } from "../ui/styles";

type FrequencyTab = "OneTime" | "Weekly" | "Biweekly" | "Monthly";

const FREQUENCY_OPTIONS = [
    { value: "OneTime", label: "One-time" },
    { value: "Weekly", label: "Weekly" },
    { value: "Biweekly", label: "Biweekly" },
    { value: "Monthly", label: "Monthly" },
] as const;

const TYPE_OPTIONS = TRANSACTION_TYPES.map(type => ({ value: type, label: type }));

const WEEKDAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"];

const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => i + 1);

const anchorValue = (anchor: MonthlyAnchorConfig) =>
    anchor.anchor === "LastDay" ? "LastDay" : String(anchor.anchor === "FirstDay" ? 1 : anchor.dayOfMonth ?? 1);

const parseAnchor = (value: string): MonthlyAnchorConfig =>
    value === "LastDay" ? { anchor: "LastDay" } : { anchor: "DayOfMonth", dayOfMonth: Number(value) };

interface TransactionFormProps {
    formId: string;
    defaultDate?: string;
    transaction?: Transaction; //edit this one instead of adding
    onSaved: () => void;
}

const frequencyOf = (rule?: RecurrenceRule): FrequencyTab => rule?.frequency ?? "OneTime";

const TransactionForm = ({ formId, defaultDate, transaction, onSaved }: TransactionFormProps) => {
    const { addTransaction, updateTransaction, completeOccurrence } = useTransactions();
    const rule = transaction?.recurrence;

    const [title, setTitle] = useState(transaction?.title ?? "");
    const [amount, setAmount] = useState(transaction ? String(transaction.amount) : "");
    const [type, setType] = useState<TransactionType>(transaction?.type ?? "Expense");
    const [categoryId, setCategoryId] = useState<number | null>(transaction?.categoryId ?? null);
    const [date, setDate] = useState(transaction?.date ?? defaultDate ?? todayKey());
    const [frequency, setFrequency] = useState<FrequencyTab>(frequencyOf(rule));
    const [dayOfWeek, setDayOfWeek] = useState(() =>
        rule && rule.frequency !== "Monthly" ? rule.dayOfWeek : parseDateKey(date).getDay());
    const [anchors, setAnchors] = useState<MonthlyAnchorConfig[]>(() =>
        rule?.frequency === "Monthly" ? rule.anchors : [{ anchor: "DayOfMonth", dayOfMonth: parseDateKey(date).getDate() }]);
    const [endDate, setEndDate] = useState(rule?.endDate ?? "");
    const [notes, setNotes] = useState(transaction?.notes ?? "");
    const [error, setError] = useState<string | null>(null);

    const categories = getCategoriesForType(type);

    const isRecurring = frequency !== "OneTime";
    //A new one-time expense is money already spent, so it's saved as paid on its date.
    const autoMarksPaid = !transaction && type === "Expense" && !isRecurring;
    const isTwiceMonthly = anchors.length > 1;

    //Only categories that fit the type are offered (no "Rent" under Savings), so reset one that doesn't fit.
    const changeType = (next: TransactionType) => {
        setType(next);
        const stillFits = getCategoriesForType(next).some(c => c.id === categoryId);
        if (!stillFits) setCategoryId(DEFAULT_CATEGORY_FOR_TYPE[next] ?? null);
    };

    const changeDate = (next: string) => {
        setDate(next);
        if (!next) return;
        //Keep the repeat pattern lined up with the start date until the user picks something else.
        const parsed = parseDateKey(next);
        setDayOfWeek(parsed.getDay());
        if (!isTwiceMonthly) setAnchors([{ anchor: "DayOfMonth", dayOfMonth: parsed.getDate() }]);
    };

    const toggleTwiceMonthly = () => {
        setAnchors(isTwiceMonthly
            ? [anchors[0]]
            : [{ anchor: "DayOfMonth", dayOfMonth: 1 }, { anchor: "DayOfMonth", dayOfMonth: 15 }]);
    };

    const buildRecurrence = (): RecurrenceRule | undefined => {
        const end = endDate || undefined;
        if (frequency === "OneTime") return undefined;
        if (frequency === "Monthly") return { frequency, anchors, endDate: end };
        return { frequency, dayOfWeek, endDate: end };
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const parsedAmount = Number(amount);

        if (!title.trim()) return setError("Give the transaction a title.");
        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return setError("Amount must be greater than $0.");
        if (categoryId === null || !categories.some(c => c.id === categoryId)) return setError("Pick a category.");
        if (!date) return setError("Pick a date.");
        if (isRecurring && endDate && endDate < date) return setError("The end date can't be before the start date.");
        if (frequency === "Monthly" && isTwiceMonthly && anchorValue(anchors[0]) === anchorValue(anchors[1])) {
            return setError("Pick two different days of the month.");
        }

        const input = {
            title: title.trim(),
            amount: Math.round(parsedAmount * 100) / 100,
            type,
            categoryId,
            date,
            recurrence: buildRecurrence(),
            notes: notes.trim() || undefined,
        };
        if (transaction) updateTransaction(transaction.id, input);
        else {
            const id = addTransaction(input);
            if (autoMarksPaid) completeOccurrence(id, date, date);
        }
        onSaved();
    };

    return (
        <form id={formId} className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
            <FloatingInput id="transaction-title" label="Title" type="text" required autoComplete="off" maxLength={60} value={title} onChange={(e) => setTitle(e.target.value)} />

            <FloatingInput id="transaction-amount" label="Amount ($)" className="no-spinner" type="number" inputMode="decimal" min={0} step="0.01" required autoComplete="off" value={amount} onChange={(e) => setAmount(e.target.value)} onWheel={(e) => e.currentTarget.blur()} />

            <SegmentedControl label="Type of transaction" value={type} options={TYPE_OPTIONS} onChange={changeType} />

            <CategorySelect categories={categories} value={categoryId} onChange={setCategoryId} />

            <div>
                <label htmlFor="transaction-date" className={labelClass}>{isRecurring ? "Starts on" : type === "Income" ? "Expected date" : "Due date"}</label>
                <input id="transaction-date" type="date" required className={inputClass} value={date} onChange={(e) => changeDate(e.target.value)} />
            </div>

            <SegmentedControl label="Frequency" value={frequency} options={FREQUENCY_OPTIONS} onChange={setFrequency} />

            {(frequency === "Weekly" || frequency === "Biweekly") && (
                <div>
                    <p className={labelClass}>Repeats on</p>
                    <RadioGroup.Root aria-label="Repeats on" className="grid grid-cols-7 gap-1" value={dayOfWeek.toString()} onValueChange={(v) => setDayOfWeek(Number(v))}>
                        {WEEKDAY_INITIALS.map((day, index) => (
                            <RadioGroup.Item key={index} value={index.toString()} className="flex aspect-square w-full cursor-pointer items-center justify-center rounded-full border border-border-subtle text-xs font-medium text-text-muted transition-colors data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-white">
                                {day}
                            </RadioGroup.Item>
                        ))}
                    </RadioGroup.Root>
                </div>
            )}

            {frequency === "Monthly" && (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-white">Twice a month</p>
                        <button type="button" role="switch" aria-checked={isTwiceMonthly} aria-label="Twice a month" onClick={toggleTwiceMonthly} className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${isTwiceMonthly ? "bg-accent" : "bg-border-subtle"}`}>
                            <span className={`absolute top-1 left-0 h-4 w-4 rounded-full bg-white transition-transform ${isTwiceMonthly ? "translate-x-6" : "translate-x-1"}`} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {anchors.map((anchor, index) => (
                            <div key={index} className={isTwiceMonthly ? "" : "col-span-2"}>
                                <label htmlFor={`anchor-${index}`} className={labelClass}>{isTwiceMonthly ? (index === 0 ? "First day" : "Second day") : "Day of month"}</label>
                                <select id={`anchor-${index}`} className={inputClass} value={anchorValue(anchor)}
                                    onChange={(e) => setAnchors(anchors.map((a, i) => (i === index ? parseAnchor(e.target.value) : a)))}>
                                    {DAY_OPTIONS.map(day => <option key={day} value={day}>{ordinal(day)}</option>)}
                                    <option value="LastDay">Last day</option>
                                </select>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-text-muted">Days past the end of a short month land on its last day.</p>
                </div>
            )}

            {isRecurring && (
                <div>
                    <label htmlFor="transaction-end" className={labelClass}>Ends on <span className="font-normal text-text-muted">(optional)</span></label>
                    <input id="transaction-end" type="date" min={date} className={inputClass} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
            )}

            <div>
                <label htmlFor="transaction-notes" className={labelClass}>Notes <span className="font-normal text-text-muted">(optional)</span></label>
                <textarea id="transaction-notes" rows={2} maxLength={200} className={`${inputClass} resize-none`} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            {autoMarksPaid && (
                <p className="text-xs text-text-muted">One-time expenses are saved as already paid on this date.</p>
            )}

            {transaction?.recurrence && (
                <p className="text-xs text-text-muted">Changes apply to every repeat. Paid and received marks are kept.</p>
            )}

            {error && <p role="alert" className="rounded bg-expense/10 px-3 py-2 text-sm text-expense">{error}</p>}
        </form>
    );
};

export default TransactionForm;
