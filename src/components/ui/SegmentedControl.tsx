import { RadioGroup } from "radix-ui";
import { labelClass } from "./styles";

interface SegmentedOption<T extends string> {
    value: T;
    label: string;
}

interface SegmentedControlProps<T extends string> {
    label: string;
    value: T;
    options: readonly SegmentedOption<T>[];
    onChange: (value: T) => void;
}

const SegmentedControl = <T extends string>({ label, value, options, onChange }: SegmentedControlProps<T>) => {
    return (
        <div>
            <p className={labelClass}>{label}</p>
            <RadioGroup.Root
                aria-label={label}
                value={value}
                onValueChange={(v) => onChange(v as T)}
                className="grid gap-1 rounded-full border-2 border-border-subtle bg-bg-surface-alt p-1"
                style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
            >
                {options.map(option => (
                    <RadioGroup.Item
                        key={option.value}
                        value={option.value}
                        className="cursor-pointer rounded-full px-1 py-2 text-xs font-medium text-text-muted transition-colors hover:text-white data-[state=checked]:bg-accent data-[state=checked]:text-white sm:text-sm"
                    >
                        {option.label}
                    </RadioGroup.Item>
                ))}
            </RadioGroup.Root>
        </div>
    );
};

export default SegmentedControl;
