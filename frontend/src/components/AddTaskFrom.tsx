import { useState } from "react";
import { Check, X } from "lucide-react";
import { Spinner } from "./Spinner";
import { type TaskPayload } from "../types/interfaces"
type Props = {
    onAdd: (payload: TaskPayload) => Promise<void>; 
    onCancel: () => void;
}

export default function AddTaskForm({ onAdd, onCancel }: Props) {
    const [draft, setDraft] = useState({ text: "", owner: "", dueText: "" });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const submit = async () => {
        if (saving) return;
        const text = draft.text.trim();
        if (!text) {
            setError("Task text can't be empty.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            await onAdd({
                text,
                owner: draft.owner.trim() || null,
                dueText: draft.dueText.trim() || null,
            });
        } catch (err: any) {
            setError(err?.response?.data?.message || "Couldn't add the task. Try again.")
        } finally {
            setSaving(false);
        }
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape" && !saving) onCancel();
        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
        }
    };

    return (
        <div className="glass-card space-y-2 p-4" onKeyDown={onKeyDown}>
            <input
                value={draft.text}
                onChange={(e) => setDraft({ ...draft, text: e.target.value })}
                placeholder="New task"
                disabled={saving}
                autoFocus
                className="glass-input w-full py-2 text-sm disabled:opacity-60"
            />
            <div className="grid gap-2 sm:grid-cols-2">
                <input
                    value={draft.owner}
                    onChange={(e) => setDraft({ ...draft, owner: e.target.value })}
                    placeholder="Owner (type Me for yourself)"
                    disabled={saving}
                    className="glass-input w-full py-2 text-sm disabled:opacity-60"
                />
                <input
                    value={draft.dueText}
                    onChange={(e) => setDraft({ ...draft, dueText: e.target.value })}
                    placeholder="Due (e.g. Nov 15)"
                    disabled={saving}
                    className="glass-input w-full py-2 text-sm disabled:opacity-60"
                />
            </div>

            {error && (
                <p role="alert" className="text-xs font-semibold text-red-700">
                    {error}
                </p>
            )}

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={submit}
                    disabled={saving}
                    className="btn-gloss flex items-center gap-1 !px-4 !py-1.5 disabled:opacity-60"
                >
                    {saving ? <Spinner size={14} className="border-ink/20 border-t-ink" /> : <Check size={14} />}
                    {saving ? "Adding..." : "Add"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={saving}
                    className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold text-ink-soft hover:bg-white/50 disabled:opacity-50"
                >
                    <X size={14} /> Cancel
                </button>
            </div>
        </div>
    );
}