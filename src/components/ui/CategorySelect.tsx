import { Icon } from "@iconify/react";
import { Select } from "radix-ui";
import type { Category } from "../../types/category";
import { labelClass } from "./styles";

interface CategorySelectProps {
    categories: Category[];
    value: number | null;
    onChange: (categoryId: number) => void;
}

const CategorySelect = ({ categories, value, onChange }: CategorySelectProps) => {
    const selected = categories.find(c => c.id === value);

    return (
        <div>
            <p className={labelClass} aria-hidden>Category</p>
            {/* Radix reports "" when the option list changes under it (e.g. switching type); ignore that */}
            <Select.Root value={selected ? selected.id.toString() : ""} onValueChange={(v) => { if (v) onChange(Number(v)); }}>
                <Select.Trigger aria-label="Category" className="flex w-full cursor-pointer items-center justify-between rounded bg-bg-surface-alt px-3 py-2 text-sm text-white outline-2 outline-border-subtle focus:outline-accent">
                    <Select.Value placeholder={<span className="text-text-muted">Select a category</span>}>
                        {selected && (
                            <span className="flex items-center gap-2">
                                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: selected.color }} />
                                {selected.name}
                            </span>
                        )}
                    </Select.Value>
                    <Select.Icon>
                        <Icon icon="mdi:chevron-down" height={20} width={20} className="text-text-muted" />
                    </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                    <Select.Content position="popper" sideOffset={6} className="z-50 max-h-64 w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-border-subtle bg-bg-surface-alt shadow-xl">
                        <Select.ScrollUpButton className="flex items-center justify-center py-1 text-text-muted">
                            <Icon icon="mdi:chevron-up" height={16} width={16} />
                        </Select.ScrollUpButton>

                        <Select.Viewport className="p-1">
                            {categories.map(category => (
                                <Select.Item key={category.id} value={category.id.toString()} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-white outline-none data-highlighted:bg-white/10 data-[state=checked]:text-accent-hover">
                                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: category.color }} />
                                    <Select.ItemText>{category.name}</Select.ItemText>
                                    <Select.ItemIndicator className="ml-auto">
                                        <Icon icon="material-symbols:check" height={16} width={16} />
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
        </div>
    );
};

export default CategorySelect;
