import { useState } from "react";
import { Pencil, Check, X, AlertTriangle } from "lucide-react";
import { Spinner } from "./Spinner";
import type { Task, TaskPatch } from "../types/interfaces";

type Props = {
    task: Task;
    onToggle?: (task: Task) => void;
    onSave?: (id: string, patch: TaskPatch) => void | Promise<void>;
};

export default function TaskCard({ task, onToggle, onSave }: Props) {
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [draft, setDraft] = useState({
        text: task.text,
        owner: task.owner ?? "",
        dueText: task.dueText ?? "",
    });
    const isMine = task.owner?.trim().toLowerCase()==="me"
    const meta = [isMine ? null : task.owner ?? "Unassigned", task.dueText].filter(Boolean).join(" · ")
    const startEdit = () => {
        setDraft({ text: task.text, owner: task.owner ?? "", dueText: task.dueText ?? "" });
        setSaveError("");
        setEditing(true);
    };
    const cancel = () => {
        if (saving) return;
        setSaveError("");
        setEditing(false);
    };

    const save = async () => {
        if (saving) return;
        const text = draft.text.trim();
        if (!text) {
            setSaveError("Task text can't be empty.");
            return;
        }

        setSaving(true);
        setSaveError("");
        try {
            await onSave?.(task._id, {
                text,
                owner: draft.owner.trim() || null,
                dueText: draft.dueText.trim() || null,
            });
            setEditing(false);
        } catch (err: any) {
            setSaveError(err?.response?.data?.message || "Couldn't save. Try again.");
        } finally {
            setSaving(false);
        }
    };

    const onEditKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") cancel();
        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            e.preventDefault();
            save();
        }
    };

    const done = task.status === "done";

    return (
        <div
            className={`glass-card flex gap-3 p-4 ${
                task.unclear ? "border-yellow-300 bg-yellow-100/90" : ""
            }`}
        >
            <span className={`orb mt-0.5 h-6 w-6 ${task.unclear ? "orb-yellow" : "orb-aqua"}`} />

            {editing ? (
                <div className="min-w-0 flex-1 space-y-2" onKeyDown={onEditKeyDown}>
                    <input
                        value={draft.text}
                        onChange={(e) => setDraft({ ...draft, text: e.target.value })}
                        placeholder="Task"
                        disabled={saving}
                        className="glass-input w-full py-2 text-sm disabled:opacity-60"
                        autoFocus
                    />
                    <div className="grid gap-2 sm:grid-cols-2">
                        <input
                            value={draft.owner}
                            onChange={(e) => setDraft({ ...draft, owner: e.target.value })}
                            placeholder="Owner"
                            disabled={saving}
                            className="glass-input w-full py-2 text-sm disabled:opacity-60"
                        />
                        <input
                            value={draft.dueText}
                            onChange={(e) => setDraft({ ...draft, dueText: e.target.value })}
                            placeholder="Due (e.g. Friday)"
                            disabled={saving}
                            className="glass-input w-full py-2 text-sm disabled:opacity-60"
                        />
                    </div>

                    {saveError && (
                        <p role="alert" className="text-xs font-semibold text-red-700">
                            {saveError}
                        </p>
                    )}

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={save}
                            disabled={saving}
                            className="btn-gloss flex items-center gap-1 !px-4 !py-1.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? <Spinner size={14} className="border-ink/20 border-t-ink" /> : <Check size={14} />}
                            {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            onClick={cancel}
                            disabled={saving}
                            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold text-ink-soft hover:bg-white/50 disabled:opacity-50"
                        >
                            <X size={14} /> Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="min-w-0 flex-1">
                        <p className={`text-sm font-extrabold text-ink ${done ? "line-through opacity-60" : ""}`}>
                            {task.text}
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-ink-soft">
                        {meta && <p className="mt-0.5 text-xs font-semibold text-ink-soft">{meta}</p>}
                        </p>
                        {task.unclear && (
                            <div className="mt-2 space-y-1">
                                <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400 bg-yellow-200 px-2 py-0.5 text-[11px] font-bold text-yellow-900">
                                    <AlertTriangle size={12} /> Needs review
                                </span>
                                {task.sourceSnippet && (
                                    <p className="line-clamp-2 text-xs italic text-ink-soft">
                                        From: “{task.sourceSnippet}”
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex shrink-0 items-start gap-2">
                        <button
                            type="button"
                            onClick={startEdit}
                            aria-label="Edit task"
                            className="rounded-lg p-1 text-ink-soft transition-colors hover:bg-white/60 hover:text-ink"
                        >
                            <Pencil size={16} />
                        </button>
                        <input
                            type="checkbox"
                            checked={done}
                            onChange={() => onToggle?.(task)}
                            aria-label={`Mark "${task.text}" as done`}
                            className="mt-1 h-5 w-5 cursor-pointer accent-aqua-500"
                        />
                    </div>
                </>
            )}
        </div>
    );
}