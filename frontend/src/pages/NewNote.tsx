import { useState } from "react";
import { Mic, Square } from "lucide-react";
import TaskCard from "../components/TaskCard";
import { Spinner } from "../components/Spinner";
import { useSpeechRecognition } from "../hooks/UseSpeechRecognition";
import { createNote, updateTask } from "../api/notes"; // adjust to your file
import type { Task, TaskPatch } from "../types/interfaces";

const errMsg = (err: any, fallback: string) => err?.response?.data?.message || fallback;

export default function NewNote() {
    const [title, setTitle] = useState("");
    const [rawText, setRawText] = useState("");
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("")
    const { supported, listening, interim, error: micError, start, stop } = useSpeechRecognition(
        (text) => setRawText((prev) => (prev.trim() ? prev.trimEnd() + " " : "") + text.trim())
    );

    const canSubmit = title.trim() !== "" && rawText.trim() !== "" && !isLoading;

    const handleCreate = async () => {
        if (!canSubmit) return;
        stop();

        const payload = { title,rawText};

        setError("");
        setIsLoading(true);
        try {
            const res = await createNote(payload);
            setTasks(res.tasks);
            setSubmitted(true);
        } catch (err) {
            setError(errMsg(err, "Couldn't create tasks. Try again."));
        } finally {
            setIsLoading(false);
        }
    };

    const toggle = async (t: Task) => {
        const next = t.status === "done" ? "todo" : "done";
        setTasks((prev) => prev.map((x) => (x._id === t._id ? { ...x, status: next } : x))); // optimistic
        try {
            const updated = await updateTask(t._id, { status: next });
            setTasks((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
        } catch (err) {
            setTasks((prev) => prev.map((x) => (x._id === t._id ? t : x))); // revert
            setError(errMsg(err, "Couldn't update the task."));
        }
    };

    const save = async (id: string, patch: TaskPatch) => {
        const updated = await updateTask(id, patch);
        setTasks((prev) => prev.map((x) => (x._id === id ? updated : x)));
    };

    return (
        <div className="grid h-full gap-3 lg:grid-cols-2">
            <section className="glass-panel flex min-h-[420px] flex-col p-6">
                <h2 className="mb-4 text-xl font-extrabold text-ink">New Note</h2>

                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isLoading}
                    placeholder="Title (e.g. Product sync, Monday)"
                    maxLength={120}
                    className="glass-input mb-3 w-full disabled:opacity-60"
                />

                <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    disabled={isLoading}
                    placeholder="Dump your notes here, or tap the mic and speak..."
                    className="glass-input w-full flex-1 resize-none disabled:opacity-60"
                />

                {(listening || micError) && (
                    <p className="mt-2 text-xs font-semibold text-ink-soft" aria-live="polite">
                        {micError ? (
                            <span className="text-red-700">{micError}</span>
                        ) : interim ? (
                            `Hearing: ${interim}`
                        ) : (
                            "Listening..."
                        )}
                    </p>
                )}

                <div className="mt-4 flex items-center gap-3">
                    {supported && (
                        <button
                            type="button"
                            onClick={listening ? stop : start}
                            disabled={isLoading}
                            aria-label={listening ? "Stop recording" : "Start voice input"}
                            aria-pressed={listening}
                            className={`rounded-full border p-2.5 transition disabled:opacity-50 ${
                                listening
                                    ? "animate-pulse border-red-300 bg-red-100 text-red-700"
                                    : "border-white/80 bg-white/70 text-ink-soft hover:text-ink"
                            }`}
                        >
                            {listening ? <Square size={18} /> : <Mic size={18} />}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleCreate}
                        disabled={!canSubmit}
                        className="btn-gloss flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading && <Spinner size={16} className="border-ink/20 border-t-ink" />}
                        {isLoading ? "Extracting..." : "Extract tasks"}
                    </button>
                </div>
            </section>

            {/* Right: created tasks */}
            <section className="glass-panel flex min-h-[420px] flex-col p-6">
                <h2 className="mb-4 text-xl font-extrabold text-ink">Created Tasks</h2>

                {error && (
                    <div
                        role="alert"
                        className="mb-3 flex items-start justify-between gap-3 rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-semibold text-red-700"
                    >
                        <span>{error}</span>
                        <button
                            type="button"
                            onClick={() => setError("")}
                            aria-label="Dismiss error"
                            className="shrink-0 font-bold hover:text-red-900"
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="flex-1 space-y-3 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex h-full items-center justify-center gap-3 text-sm font-bold text-ink-soft">
                            <Spinner /> Reading your note...
                        </div>
                    ) : tasks.length > 0 ? (
                        tasks.map((task) => (
                            <TaskCard key={task._id} task={task} onToggle={toggle} onSave={save} />
                        ))
                    ) : (
                        <p className="pt-8 text-center text-sm font-semibold text-ink-faint">
                            {submitted ? "No tasks found in that note." : "Your tasks will show up here."}
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}