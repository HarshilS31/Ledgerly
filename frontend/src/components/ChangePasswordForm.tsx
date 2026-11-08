import { useState } from "react";
import PasswordInput from "./PasswordInput";
import { Spinner } from "./Spinner";
import { change_Password } from "../api/auth"

const MIN_PASSWORD = 8; 
const labelCls = "mb-1.5 ml-1 block text-sm font-bold text-ink-soft";

type Props = { onDone: () => void; onCancel: () => void };

export default function ChangePasswordForm({ onDone, onCancel }: Props) {
    const [current, setCurrent] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirm, setConfirm] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const canSubmit = current !== "" && newPw !== "" && confirm !== "" && !saving;
    const mismatch = confirm !== "" && newPw !== confirm;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        if (newPw.length < MIN_PASSWORD) {
            setError(`New password must be at least ${MIN_PASSWORD} characters.`);
            return;
        }
        if (newPw !== confirm) {
            setError("The new passwords don't match.");
            return;
        }
        if (newPw === current) {
            setError("The new password must be different from the current one.");
            return;
        }

        setSaving(true);
        setError("");
        try {
            await change_Password(current, newPw);
            onDone();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Couldn't update your password. Try again.");
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {error && (
                <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-semibold text-red-700">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="current-password" className={labelCls}>Current password</label>
                <PasswordInput
                    id="current-password"
                    autoComplete="current-password"
                    autoFocus
                    value={current}
                    onChange={(e) => { setCurrent(e.target.value); setError(""); }}
                    disabled={saving}
                    placeholder="••••••••"
                />
            </div>

            <div>
                <label htmlFor="new-password" className={labelCls}>New password</label>
                <PasswordInput
                    id="new-password"
                    autoComplete="new-password"
                    value={newPw}
                    onChange={(e) => { setNewPw(e.target.value); setError(""); }}
                    disabled={saving}
                    placeholder="At least 8 characters"
                />
            </div>

            <div>
                <label htmlFor="confirm-password" className={labelCls}>Confirm new password</label>
                <PasswordInput
                    id="confirm-password"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                    disabled={saving}
                    placeholder="••••••••"
                />
                {mismatch && <p className="ml-1 mt-1.5 text-xs font-semibold text-red-700">Passwords don't match.</p>}
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="btn-gloss flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {saving && <Spinner size={16} className="border-ink/20 border-t-ink" />}
                    {saving ? "Updating..." : "Update password"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={saving}
                    className="rounded-full px-4 py-2 text-sm font-bold text-ink-soft hover:bg-white/60 disabled:opacity-50"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}