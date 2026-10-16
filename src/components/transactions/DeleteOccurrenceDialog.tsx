import { AlertDialog } from "radix-ui";
import { useTransactions } from "../../hooks/useTransactions";
import type { Occurrence } from "../../types/transaction";
import { formatShortDate } from "../../utils/date";
import { secondaryButtonClass } from "../ui/styles";

interface DeleteOccurrenceDialogProps {
    occurrence: Occurrence;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const dangerButtonClass =
    "w-full cursor-pointer rounded bg-expense/15 px-3 py-2 text-left text-sm font-medium text-expense transition-colors hover:bg-expense/25";

const DeleteOccurrenceDialog = ({ occurrence, isOpen, onOpenChange }: DeleteOccurrenceDialogProps) => {
    const { deleteTransaction, skipOccurrence, endSeriesBefore } = useTransactions();
    const { transaction, expectedDate } = occurrence;
    const isRecurring = Boolean(transaction.recurrence);

    const run = (action: () => void) => {
        action();
        onOpenChange(false);
    };

    return (
        <AlertDialog.Root open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 z-40 bg-black/60" />
                <AlertDialog.Content className="fixed top-1/2 left-1/2 z-40 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border-subtle bg-bg-surface p-5 shadow-xl">
                    <AlertDialog.Title className="text-lg font-semibold text-white">Delete “{transaction.title}”?</AlertDialog.Title>
                    <AlertDialog.Description className="mt-1 text-sm text-text-muted">
                        {isRecurring
                            ? `This repeats. Choose what to remove, starting from ${formatShortDate(expectedDate)}.`
                            : "This can't be undone."}
                    </AlertDialog.Description>

                    <div className="mt-4 flex flex-col gap-2">
                        {isRecurring ? (
                            <>
                                <button type="button" className={dangerButtonClass} onClick={() => run(() => skipOccurrence(transaction.id, expectedDate))}>
                                    Only this one ({formatShortDate(expectedDate)})
                                </button>
                                <button type="button" className={dangerButtonClass} onClick={() => run(() => endSeriesBefore(transaction.id, expectedDate))}>
                                    This and all future repeats
                                </button>
                                <button type="button" className={dangerButtonClass} onClick={() => run(() => deleteTransaction(transaction.id))}>
                                    Every repeat, past and future
                                </button>
                            </>
                        ) : (
                            <button type="button" className={dangerButtonClass} onClick={() => run(() => deleteTransaction(transaction.id))}>
                                Delete
                            </button>
                        )}
                        <AlertDialog.Cancel className={`${secondaryButtonClass} mt-1`}>Cancel</AlertDialog.Cancel>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
};

export default DeleteOccurrenceDialog;
