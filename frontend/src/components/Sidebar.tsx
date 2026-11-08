import {NavLink, replace} from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {logoutUser} from "../api/auth"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
export default function Sidebar() { 
    const navigate = useNavigate();
    const {user,logout} = useAuth()
const [confirmOpen, setConfirmOpen] = useState(false);
const [loggingOut, setLoggingOut] = useState(false);

const handleLogout = async () => {
    setLoggingOut(true);
    try {
        await logout();
        navigate("/login", { replace: true });
    } finally {
        setLoggingOut(false);
        setConfirmOpen(false);
    }
};
    return (
        <aside className="glass-panel flex h-full w-64 shrink-0 flex-col p-5">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="orb orb-aqua h-7 w-7" />
                    <span className="text-xl font-extrabold text-ink">Ledgerly</span>
                </div>
            </div>
            <nav className="space-y-1">
                <NavLink
                    to="/new-note"
                    className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
                >
                    <span className="orb orb-aqua" />
                    New Note
                </NavLink>
                <NavLink
                    to="/my-notes"
                    className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
                >
                    <span className="orb orb-aqua" />
                    My Notes
                </NavLink>
                <NavLink
                    to="/settings"
                    className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}
                >
                    <span className="orb orb-aqua" />
                    Settings
                </NavLink>
            </nav>
            <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/60 pt-4">
                <div className="flex min-w-0 items-center gap-2">
                    <span className="orb orb-orange h-8 w-8" />
                    <span className="truncate text-sm font-bold text-ink">{user?.username}</span>
                </div>
                <button onClick={() => setConfirmOpen(true)} className="text-xs font-bold text-ink-soft transition-colors hover:text-red-600">Logout</button>
                <ConfirmDialog
                    open={confirmOpen}
                    title="Log out of Ledgerly?"
                    message="You'll need to sign in again to see your notes."
                    confirmLabel="Log out"
                    loading={loggingOut}
                    onConfirm={handleLogout}
                    onCancel={() => setConfirmOpen(false)}
                />
                

            </div>
        </aside>
    );
}