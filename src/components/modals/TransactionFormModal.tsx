import { useId } from "react";
import BaseModal from "./BaseModal";
import TransactionForm from "../transactions/TransactionForm";
import type { Transaction } from "../../types/transaction";

interface TransactionFormModalProps{
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    defaultDate?: string;
    transaction?: Transaction; //pass to edit instead of add
}

//The form unmounts when the dialog closes, so every open starts with a fresh form.
const TransactionFormModal = ({isOpen, onOpenChange, defaultDate, transaction}: TransactionFormModalProps) => {
    const formId = useId();

    return(
        <BaseModal isOpen={isOpen} onOpenChange={onOpenChange} title={transaction ? "Edit Transaction" : "Add Transaction"} formId={formId} submitLabel={transaction ? "Save" : "Add"}>
            <TransactionForm formId={formId} defaultDate={defaultDate} transaction={transaction} onSaved={() => onOpenChange(false)} />
        </BaseModal>
    );
}

export default TransactionFormModal;
