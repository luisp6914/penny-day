import { Dialog } from "radix-ui";
import { primaryButtonClass, secondaryButtonClass } from "../ui/styles";

interface BaseModalProps{
    title: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    formId: string; //the submit button submits this <form>, so native validation runs
    submitLabel?: string;
    cancelLabel?: string;
}

const BaseModal = ({title, isOpen, onOpenChange, children, formId, submitLabel = "Submit", cancelLabel = "Cancel"}: BaseModalProps) => {

    return(
        <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60"/>
                <Dialog.Content aria-describedby={undefined} onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()} className="fixed top-1/2 left-1/2 z-40 max-h-[90vh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border-subtle bg-bg-surface p-6 shadow-xl">
                    <Dialog.Title className="mb-4 text-xl font-semibold text-white">{title}</Dialog.Title>

                    <div>{children}</div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Dialog.Close className={secondaryButtonClass}>{cancelLabel}</Dialog.Close>
                        <button type="submit" form={formId} className={primaryButtonClass}>{submitLabel}</button>
                    </div>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default BaseModal;
