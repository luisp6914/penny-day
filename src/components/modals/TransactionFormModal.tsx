import { useState } from "react";
import BaseModal from "./BaseModal";
import { RadioGroup, Select } from "radix-ui";
import type { TransactionDirection } from "../../types/transaction";
import { Icon } from "@iconify/react";
import { DEFAULT_CATEGORIES } from "../../constants/defaultCategories";
import type { MonthlyAnchorConfig, RecurrenceFrequency } from "../../types/recurrence";

interface TransactionFormModalProp{
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

type FrequencyTab = "OneTime" | "Weekly" | "Monthly";

const TransationFormModal = ( {isOpen, setIsOpen}: TransactionFormModalProp) => {

    //Title state
    const [title, setTitle] = useState<string>("");

    //The amount state
    const [amount, setAmount] = useState<number>();

    //Type of transaction state
    const [direction, setDirection] = useState<TransactionDirection>("Expense");

    //Category States
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const selectedCategory = DEFAULT_CATEGORIES.find(c => c.id === categoryId); 

    //Frequency states
    const [frequencyTab, setFrequencyTab] = useState<FrequencyTab>("OneTime");
    const [isRecurring, setIsRecurring] = useState<boolean>(false);
    const [frequency, setFrequency] = useState<RecurrenceFrequency>("Weekly");
    const [dayOfWeek, setDayOfWeek] = useState<number>(0);
    const [isBiweekly, setIsBiweekly] = useState<boolean>(false);
    const [anchors, setAnchors] = useState<MonthlyAnchorConfig[]>([
        {anchor: "DayOfMonth", dayOfMonth: 1}
    ]);


    const onSubmit = ()=> {
        //TODO
    }

    return(
        <BaseModal isOpen={isOpen} onClose={setIsOpen} title="Add Transaction" onSubmit={onSubmit}>
            <form className="flex flex-col gap-5" action="">
                {/*Title field */}
                <div className="relative">
                    <input className="peer outline-2 outline-border-subtle focus:outline-[#625FFF] rounded w-full pt-5 pr-2 pb-2 pl-2 bg-bg-surface-alt text-white" placeholder=" " type="text" id="transaction-title" required autoComplete="off" value={title}  onChange={(e) => setTitle(e.target.value)} />
                    <label htmlFor="transaction-title" className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-sm transition-all duration-200 peer-focus:top-2.5 peer-focus:text-[0.7rem] peer-focus:text-white peer-focus:-translate-y- peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:top-2.5 peer-not-placeholder-shown:text-[0.7rem] peer-not-placeholder-shown:text-white peer-[:not(:placeholder-shown)]:-translate-y-">Title</label>
                </div>

                {/*Amount Field */}
                <div className="relative">
                    <input className="peer outline-2 outline-border-subtle focus:outline-[#625FFF] rounded w-full pt-5 pr-2 pb-2 pl-2 bg-bg-surface-alt text-white no-spinner" placeholder=" " type="number" min={0} step="0.01" id="transaction-amount" required autoComplete="off" value={amount}  onChange={(e) => setAmount(Number(e.target.value))} onWheel={(e) => e.currentTarget.blur()}/>
                    <label htmlFor="transaction-amount" className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-sm transition-all duration-200 peer-focus:top-2.5 peer-focus:text-[0.7rem] peer-focus:text-white peer-focus:-translate-y- peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:top-2.5 peer-not-placeholder-shown:text-[0.7rem] peer-not-placeholder-shown:text-white peer-[:not(:placeholder-shown)]:-translate-y-">Amount</label>
                </div>

                {/* Direction(type) */}
                <div>
                    <p className="text-xs text-white font-semibold mb-2">Type Of Transaction:</p>
                    <RadioGroup.Root value={direction} onValueChange={(value) => setDirection(value as TransactionDirection)} className="grid grid-cols-2 p-1 rounded-full bg-surface-elevated border-2 border-border-subtle">
                    
                        <RadioGroup.Item value="Income" className="px-6 py-2 rounded-full text-sm font-medium transition-colors data-[state=unchecked]:text-text-muted data-[state=checked]:text-white data-[state=checked]:bg-accent">
                            Income
                        </RadioGroup.Item>
                    
                    
                        <RadioGroup.Item value="Expense" className="px-6 py-2 rounded-full text-sm font-medium transition-colors data-[state=unchecked]:text-text-muted data-[state=checked]:text-white data-[state=checked]:bg-accent">
                            Expense
                        </RadioGroup.Item>
                    
                    </RadioGroup.Root>
                </div>

                {/* Category */}
                <Select.Root value={categoryId?.toString() ?? ""} onValueChange={(value) => setCategoryId(Number(value))}>
                    <Select.Trigger className="flex items-center justify-between w-full rounded outline-2 outline-border-subtle focus:outline-accent bg-surface-alt text-white px-3 py-3">
                        <Select.Value placeholder="Select a categoty">
                            {selectedCategory ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full flex shrink-0" style={{backgroundColor: selectedCategory.color}}></span>
                                    {selectedCategory.name}
                                </span>
                            ): null}
                        </Select.Value>
                        <Select.Icon>
                            <Icon icon="mdi:arrow-down-drop" height={30} width={30} className="text-text-muted" />
                        </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                        <Select.Content position="popper" sideOffset={6} className="w-(--radix-select-trigger-width) max-h-64 overflow-hidden rounded-lg bg-bg-surface-alt border border-border-subtle shadow-xl z-50">
                            
                            <Select.ScrollUpButton className="flex items-center justify-center py-1 text-text-muted">
                                <Icon icon="mdi:chevron-up" height={16} width={16} />
                            </Select.ScrollUpButton>
                            
                            <Select.Viewport className="p-1">
                                {DEFAULT_CATEGORIES.map((category) => (
                                    <Select.Item key={category.id} value={category.id.toString()} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-white outline-none cursor-pointer data-highlighted:bg-surface-elevated data-[state=checked]:text-accent">
                                        <span className={`w-3 h-3 rounded-full flex shrink-0`} style={{ backgroundColor: category.color }}/>
                                        <Select.ItemText>{category.name}</Select.ItemText>
                                        <Select.ItemIndicator className="ml-auto">
                                            <Icon icon="material-symbols:check" height={16} width={16}/>
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                ))}
                            </Select.Viewport>

                            <Select.ScrollDownButton className="flex items-center justify-center py-1 text-text-muted">
                                <Icon icon="mdi:chevron-down" height={16} width={16} />
                            </Select.ScrollDownButton>

                        </Select.Content>
                    </Select.Portal>
                </Select.Root>

                {/* Frequency */}
                <div>
                    <p className="text-xs text-white font-semibold mb-2">Transaction Frequency:</p>
                    <RadioGroup.Root className="grid grid-cols-3 p-1 rounded-full bg-surface-elevated border-2 border-border-subtle"  value={frequencyTab}
                        onValueChange={(v) => {
                            const tab = v as FrequencyTab;
                            setFrequencyTab(tab);
                            setIsRecurring(tab !== "OneTime");
                            if(tab === "Weekly") setFrequency("Weekly");
                            if(tab === "Monthly") setFrequency("Monthly");
                        }}>
                        <RadioGroup.Item className="py-2 rounded-full text-sm font-medium transition-colors text-text-muted data-[state=checked]:bg-accent data-[state=checked]:text-white" value="OneTime">
                            One-Time
                        </RadioGroup.Item>
                        <RadioGroup.Item className="py-2 rounded-full text-sm font-medium transition-colors text-text-muted data-[state=checked]:bg-accent data-[state=checked]:text-white" value="Weekly">
                            Weekly
                        </RadioGroup.Item>
                        <RadioGroup.Item className="py-2 rounded-full text-sm font-medium transition-colors text-text-muted data-[state=checked]:bg-accent data-[state=checked]:text-white" value="Monthly">
                            Monthly
                        </RadioGroup.Item>
                    </RadioGroup.Root>
                </div>

                {/* Weely */}
                {frequencyTab === "Weekly" && (
                    <div>
                        <p className="text-xs text-text-muted mb-2">Repeats on</p>
                        <RadioGroup.Root className="grid grid-cols-7 gap-1" value={dayOfWeek.toString()} onValueChange={(v) => setDayOfWeek(Number(v))}>
                            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                                <RadioGroup.Item key={day + index} value={index.toString()} className="flex items-center justify-center w-full aspect-square rounded-full text-xs font-medium transition-colors border border-border-subtle text-text-muted data-[state=checked]:bg-accent data-[state=checked]:text-white data-[state=checked]:border-accent">
                                    {day}
                                </RadioGroup.Item>
                            ))}
                        </RadioGroup.Root>
                    </div>
                )}

                {/* Monthly */}
                {frequencyTab === "Monthly" && (
                    <div className="flex flex-col gap-4">
                        {/* Biweekly toggle */}
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-white">Twice a month</p>
                            <button type="button" role="switch" aria-checked={isBiweekly} className={`w-11 h-6 rounded-full transition-colors relative ${isBiweekly ? "bg-accent" : "bg-border-subtle"}`}
                                onClick={() => {
                                    const next = !isBiweekly;
                                    setIsBiweekly(next);
                                    setAnchors(
                                        next
                                            ? [
                                                {anchor: "DayOfMonth", dayOfMonth: 1},
                                                {anchor: "DayOfMonth", dayOfMonth: 15}
                                            ] : [{anchor: "DayOfMonth", dayOfMonth: 1}]
                                    );
                                }}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isBiweekly ? "translate-x-6" : "translate-x-1"}`} />
                            </button>

                            {/* Anchor picker(s) */}
                            
                        </div>
                    </div>
                )}
            </form>
        </BaseModal>
    );
}

export default TransationFormModal;