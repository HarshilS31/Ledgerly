import { useEffect, useRef } from "react";
import { Spinner } from "./Spinner";

type Props = {
    open: boolean;
    title: string;
    message?: string;
    confirmLabel?: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmDialog({
    open, title, message, confirmLabel = "Confirm", loading = false, onConfirm, onCancel,
}: Props) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const d = ref.current;
        if (!d) return;
        if (open && !d.open) d.showModal();
        if (!open && d.open) d.close();
    }, [open]);

    return (
        <dialog
            ref={ref}
            onCancel={(e) => {            
                e.preventDefault();
                if (!loading) onCancel();
            }}
            onClick={(e) => {      
                if (e.target === ref.current && !loading) onCancel();
            }}
            className="glass-card m-auto w-full max-w-sm p-0 text-ink backdrop:bg-ink/30 backdrop:backdrop-blur-sm"
        >
            <div className="p-6">
                <h3 className="text-lg font-extrabold">{title}</h3>
                {message && <p className="mt-2 text-sm font-semibold text-ink-soft">{message}</p>}

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-full px-4 py-2 text-sm font-bold text-ink-soft hover:bg-white/60 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="btn-gloss flex items-center gap-2 disabled:opacity-60"
                    >
                        {loading && <Spinner size={14} className="border-ink/20 border-t-ink" />}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </dialog>
    );
}