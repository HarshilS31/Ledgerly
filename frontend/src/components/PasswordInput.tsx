import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export default function PasswordInput({ className = "", ...rest }: Props) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative">
            <input
                {...rest}
                type={show ? "text" : "password"}
                className={`glass-input block w-full pr-11 sm:text-sm ${className}`}
            />
            <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                aria-pressed={show}
                className="absolute inset-y-0 right-3 flex items-center text-ink-faint transition-colors hover:text-ink"
            >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
}