import { useState } from "react";
import BaseModal from "./BaseModal";
import { RadioGroup, Select } from "radix-ui";
import type { TransactionDirection } from "../../types/transaction";

interface TransactionFormModalProp{
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const TransationFormModal = ( {isOpen, setIsOpen}: TransactionFormModalProp) => {

    const [title, setTitle] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [direction, setDirection] = useState<TransactionDirection>("Expense");
    

    const onSubmit = ()=> {
        //TODO
    }

    return(
        <BaseModal isOpen={isOpen} onClose={setIsOpen} title="Add Transaction" onSubmit={onSubmit}>
            <form className="flex flex-col gap-5" action="">
                {/*Title field */}
                <div className="relative">
                    <input className="peer outline-2 outline-[#2E3542] focus:outline-[#625FFF] rounded w-full pt-5 pr-2 pb-2 pl-2 bg-[#212835] text-white" placeholder=" " type="text" id="transaction-title" required autoComplete="off" value={title}  onChange={(e) => setTitle(e.target.value)} />
                    <label htmlFor="transaction-title" className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-sm transition-all duration-200 peer-focus:top-2.5 peer-focus:text-[0.7rem] peer-focus:text-white peer-focus:-translate-y- peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:top-2.5 peer-not-placeholder-shown:text-[0.7rem] peer-not-placeholder-shown:text-white peer-[:not(:placeholder-shown)]:-translate-y-">Title</label>
                </div>

                {/*Amount Field */}
                <div className="relative">
                    <input className="peer outline-2 outline-[#2E3542] focus:outline-[#625FFF] rounded w-full pt-5 pr-2 pb-2 pl-2 bg-[#212835] text-white no-spinner" placeholder=" " type="number" min={0} id="transaction-amount" required autoComplete="off" value={amount}  onChange={(e) => setAmount(Number(e.target.value))} onWheel={(e) => e.currentTarget.blur()}/>
                    <label htmlFor="transaction-amount" className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-sm transition-all duration-200 peer-focus:top-2.5 peer-focus:text-[0.7rem] peer-focus:text-white peer-focus:-translate-y- peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:top-2.5 peer-not-placeholder-shown:text-[0.7rem] peer-not-placeholder-shown:text-white peer-[:not(:placeholder-shown)]:-translate-y-">Amount</label>
                </div>

                {/* Direction(type) */}
                <RadioGroup.Root value={direction} onValueChange={(value) => setDirection(value as TransactionDirection)}>
                    <label>
                        <RadioGroup.Item value="Income" className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center data-[state=checked]:border-blue-600">
                            <RadioGroup.Indicator className="w-2.5 h-2.5 rounded-full bg-blue-600"/>
                        </RadioGroup.Item>
                        Income
                    </label>

                    <label>
                        <RadioGroup.Item value="Expense" className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center data-[state=checked]:border-blue-600">
                            <RadioGroup.Indicator className="w-2.5 h-2.5 rounded-full bg-blue-600"/>
                        </RadioGroup.Item>
                        Expense
                    </label>
                </RadioGroup.Root>
            </form>
        </BaseModal>
    );
}

export default TransationFormModal;