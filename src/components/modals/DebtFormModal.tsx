import { useId } from "react";
import BaseModal from "./BaseModal";
import DebtForm from "../loans/DebtForm";
import type { Debt } from "../../types/debt";

interface DebtFormModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    debt?: Debt; //pass to edit instead of add
}

const DebtFormModal = ({ isOpen, onOpenChange, debt }: DebtFormModalProps) => {
    const formId = useId();

    return (
        <BaseModal isOpen={isOpen} onOpenChange={onOpenChange} title={debt ? "Edit Loan or Card" : "Add Loan or Card"} formId={formId} submitLabel={debt ? "Save" : "Add"}>
            <DebtForm formId={formId} debt={debt} onSaved={() => onOpenChange(false)} />
        </BaseModal>
    );
};

export default DebtFormModal;
