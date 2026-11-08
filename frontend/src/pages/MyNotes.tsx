import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus } from "lucide-react";
import TaskCard from "../components/TaskCard";
import ConfirmDialog from "../components/ConfirmDialog";
import { Spinner } from "../components/Spinner";
import AddTaskForm from "../components/AddTaskFrom";
import { getNotes, updateTask, deleteNote, addTask, deleteTask } from "../api/notes";
import type { Note, Task, TaskPayload } from "../types/interfaces";

type TaskPatch = Pick<Task, "text" | "owner" | "dueText">;
type Order = "latest" | "oldest";

const errMsg = (err: any, fallback: string) => err?.response?.data?.message || fallback;

const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
        day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit",
    })

export default function MyNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [order, setOrder] = useState<Order>("latest")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [pendingDelete, setPendingDelete] = useState<Note | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [addingFor, setAddingFor] = useState<string | null>(null)
    const [pendingTask, setPendingTask] = useState<Task | null>(null)
    const [deletingTask, setDeletingTask] = useState(false)

    const load = async () => {
        setError("");
        setIsLoading(true);
        try {
            setNotes(await getNotes());
        } catch (err) {
            setError(errMsg(err, "Couldn't load your notes."));
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load()
    }, [])

    const sorted = useMemo(() => {
        const dir = order === "latest" ? -1 : 1;
        return [...notes].sort(
            (a, b) => dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        );
    }, [notes, order])

    const replaceTask = (updated: Task) =>
        setNotes((prev) =>
            prev.map((n) =>
                n._id === updated.noteId
                    ? { ...n, tasks: n.tasks.map((t) => (t._id === updated._id ? updated : t)) }
                    : n
            )
        )

    const toggle = async (t: Task) => {
        const next = t.status === "done" ? "todo" : "done";
        replaceTask({ ...t, status: next });
        try {
            replaceTask(await updateTask(t._id, { status: next }));
        } catch (err) {
            replaceTask(t); 
            setError(errMsg(err, "Couldn't update the task."));
        }
    }

    const save = async (id: string, patch: TaskPatch) => {
        replaceTask(await updateTask(id, patch));
    }

    const addToNote = async (noteId: string, payload: TaskPayload) => {
        const task = await addTask(noteId, payload);
        setNotes((prev) => prev.map((n) => (n._id === noteId ? { ...n, tasks: [...n.tasks, task] } : n)));
        setAddingFor(null);
    }

    const confirmTaskDelete = async () => {
        if (!pendingTask) return;
        const t = pendingTask;
        setDeletingTask(true);
        try {
            await deleteTask(t._id);
            setNotes((prev) =>
                prev.map((n) => (n._id === t.noteId ? { ...n, tasks: n.tasks.filter((x) => x._id !== t._id) } : n))
            );
        } catch (err) {
            setError(errMsg(err, "Couldn't delete the task."));
        } finally {
            setDeletingTask(false);
            setPendingTask(null);
        }
    };

    const confirmDelete = async () => {
        if (!pendingDelete) return;
        setDeleting(true);
        try {
            await deleteNote(pendingDelete._id);
            setNotes((prev) => prev.filter((n) => n._id !== pendingDelete._id));
            setPendingDelete(null);
        } catch (err) {
            setError(errMsg(err, "Couldn't delete the note."));
            setPendingDelete(null);
        } finally {
            setDeleting(false);
        }
    };

    const doneCount = (n: Note) => n.tasks.filter((t) => t.status === "done").length;

    return (
        <div className="mx-auto flex max-w-4xl flex-col gap-3 pb-3">
            <header className="glass-panel flex items-center justify-between gap-3 p-6">
                <div>
                    <h2 className="text-xl font-extrabold text-ink">My Notes</h2>
                    {!isLoading && !error && (
                        <p className="text-xs font-semibold text-ink-soft">
                            {notes.length} {notes.length === 1 ? "note" : "notes"}
                        </p>
                    )}
                </div>

                <select
                    value={order}
                    onChange={(e) => setOrder(e.target.value as Order)}
                    aria-label="Sort notes"
                    className="glass-input py-2 text-sm font-bold"
                >
                    <option value="latest">Latest first</option>
                    <option value="oldest">Oldest first</option>
                </select>
            </header>

            {error && (
                <div
                    role="alert"
                    className="flex items-start justify-between gap-3 rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-semibold text-red-700"
                >
                    <span>{error}</span>
                    <div className="flex shrink-0 gap-3">
                        <button type="button" onClick={load} className="font-bold underline hover:text-red-900">
                            Retry
                        </button>
                        <button
                            type="button"
                            onClick={() => setError("")}
                            aria-label="Dismiss error"
                            className="font-bold hover:text-red-900"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="glass-panel flex items-center justify-center gap-3 p-10 text-sm font-bold text-ink-soft">
                    <Spinner /> Loading your notes...
                </div>
            ) : sorted.length === 0 && !error ? (
                <div className="glass-panel p-10 text-center">
                    <p className="text-sm font-semibold text-ink-soft">No notes yet.</p>
                    <Link to="/new-note" className="btn-gloss mt-4 inline-block">
                        Write your first note
                    </Link>
                </div>
            ) : (
                sorted.map((note) => (
                    <section key={note._id} className="glass-panel p-6">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h3 className="truncate text-lg font-extrabold text-ink">{note.title}</h3>
                                <p className="text-xs font-semibold text-ink-soft">{formatDate(note.createdAt)}</p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                {note.tasks.length > 0 && (
                                    <span className="chip">
                                        {doneCount(note)}/{note.tasks.length} done
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setPendingDelete(note)}
                                    aria-label={`Delete note "${note.title}"`}
                                    className="rounded-lg p-1.5 text-ink-soft transition-colors hover:bg-white/60 hover:text-red-600"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3">
                            {note.tasks.length === 0 && (
                                <p className="text-sm font-semibold text-ink-faint">No tasks were found in this note.</p>
                            )}

                            {note.tasks.map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onToggle={toggle}
                                    onSave={save}
                                    onDelete={setPendingTask}
                                />
                            ))}

                            {addingFor === note._id ? (
                                <AddTaskForm
                                    onAdd={(p) => addToNote(note._id, p)}
                                    onCancel={() => setAddingFor(null)}
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setAddingFor(note._id)}
                                    className="flex items-center gap-1 text-sm font-bold text-ink-soft hover:text-ink"
                                >
                                    <Plus size={16} /> Add task
                                </button>
                            )}
                        </div>

                        <details className="mt-4 text-sm">
                            <summary className="cursor-pointer font-bold text-ink-soft hover:text-ink">
                                Original text
                            </summary>
                            <p className="mt-2 whitespace-pre-wrap font-semibold text-ink-soft">{note.rawText}</p>
                        </details>
                    </section>
                ))
            )}

            <ConfirmDialog
                open={pendingDelete !== null}
                title="Delete this note?"
                message={
                    pendingDelete
                        ? `"${pendingDelete.title}" and its ${pendingDelete.tasks.length} ${
                              pendingDelete.tasks.length === 1 ? "task" : "tasks"
                          } will be permanently deleted.`
                        : ""
                }
                confirmLabel="Delete"
                loading={deleting}
                onConfirm={confirmDelete}
                onCancel={() => setPendingDelete(null)}
            />

            <ConfirmDialog
                open={pendingTask !== null}
                title="Delete this task?"
                message={pendingTask ? `"${pendingTask.text}" will be permanently deleted.` : ""}
                confirmLabel="Delete"
                loading={deletingTask}
                onConfirm={confirmTaskDelete}
                onCancel={() => setPendingTask(null)}
            />
        </div>
    );
}