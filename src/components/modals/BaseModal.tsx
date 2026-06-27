import { Dialog } from "radix-ui";

interface BaseModalProps{
    title: string;
    isOpen: boolean;
    onClose: (open: boolean) => void;
    children: React.ReactNode;
    onSubmit: () => void;
    submitLabel?: string;
    cancelLabel?: string;
}

const BaseModal = ({title, isOpen, onClose, children, onSubmit, submitLabel = "Submit", cancelLabel = "Cancel"}: BaseModalProps) => {
    
    return(
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50"/>
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1E2938] border border-[#ffffff1a] rounded-lg p-6 w-full max-w-md shadow-xl">
                    <Dialog.Title className="text-xl text-white font-semibold mb-4"> {title} </Dialog.Title>

                    <div>{children}</div>

                    <div className="flex justify-end gap-3 mt-5">
                        <Dialog.Close className="px-4 py-2 rounded text-white bg-[#3A4350] hover:bg-[#535B66]"> {cancelLabel} </Dialog.Close>
                        <button onClick={onSubmit} className="px-4 py-2 rounded text-white bg-[#625FFF] hover:bg-[#7C86FF]"> {submitLabel} </button>
                    </div>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default BaseModal;