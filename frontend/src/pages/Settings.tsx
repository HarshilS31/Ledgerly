import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ChangePasswordForm from "../components/ChangePasswordForm";

export default function Settings() {
    const { user } = useAuth();

    const [changing, setChanging] = useState(false);
    const [notice, setNotice] = useState("");

    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-3 pb-3">
            <h2 className="px-2 pt-1 text-xl font-extrabold text-ink">Settings</h2>

            {/* Account (read-only) */}
            <section className="glass-panel p-6">
                <h3 className="mb-4 text-lg font-extrabold text-ink">Account</h3>

                <div className="flex items-center gap-4">
                    <span className="orb orb-orange flex h-12 w-12 items-center justify-center text-lg font-extrabold text-ink">
                        {user?.username?.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-base font-extrabold text-ink">{user?.username}</p>
                        <p className="truncate text-sm font-semibold text-ink-soft">{user?.email}</p>
                    </div>
                </div>
            </section>
            <section className="glass-panel p-6">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-extrabold text-ink">Password</h3>
                        <p className="text-sm font-semibold text-ink-soft">Change it whenever you like.</p>
                    </div>
                    {!changing && (
                        <button
                            type="button"
                            onClick={() => {
                                setNotice("");
                                setChanging(true);
                            }}
                            className="btn-gloss shrink-0"
                        >
                            Change password
                        </button>
                    )}
                </div>

                {notice && (
                    <div
                        role="status"
                        className="mt-4 rounded-xl border border-mint-600/40 bg-mint-100 p-3 text-sm font-bold text-mint-800"
                    >
                        {notice}
                    </div>
                )}

                {changing && (
                    <ChangePasswordForm
                        onDone={() => {
                            setChanging(false);
                            setNotice("Password updated.");
                        }}
                        onCancel={() => setChanging(false)}
                    />
                )}
            </section>
        </div>
    );
}
