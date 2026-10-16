type FloatingInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "placeholder"> & {
    id: string;
    label: string;
};

//Text/number input whose label floats up once the field has focus or a value.
const FloatingInput = ({ id, label, className = "", ...props }: FloatingInputProps) => {
    return (
        <div className="relative">
            <input
                id={id}
                placeholder=" "
                className={`peer w-full rounded bg-bg-surface-alt px-2 pt-5 pb-2 text-white outline-2 outline-border-subtle focus:outline-accent ${className}`}
                {...props}
            />
            <label
                htmlFor={id}
                className="pointer-events-none absolute top-2 left-2 text-[0.7rem] text-text-muted transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[0.7rem] peer-focus:text-white"
            >
                {label}
            </label>
        </div>
    );
};

export default FloatingInput;
