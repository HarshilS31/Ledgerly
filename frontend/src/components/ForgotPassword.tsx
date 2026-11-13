import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { Spinner } from "../components/Spinner";
import { forgotPassword } from "../api/auth"; // apne path ke hisaab se

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading || !email.trim()) return;

        setError("");
        setLoading(true);
        try {
            await forgotPassword(email.trim());
            setSent(true);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="glass-panel relative w-full max-w-md space-y-6 overflow-hidden p-8">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/50 to-transparent" />
                <div className="relative z-10 text-center">
                    <h2 className="text-2xl font-extrabold tracking-tight text-ink">Password Reset coming soon</h2>
                        <p className="mt-2 text-sm text-ink-soft">

                    We're currently working on bringing password recovery to Ledgerly.
                    
                    For now, password reset functionality is temporarily unavailable. We're working to make it available soon.
                    
                    Thanks for your patience!</p>
                </div>
            <div className="flex gap-2">
                <button
                    type="button"
                    className="btn-gloss flex items-center gap-1 !px-4 !py-1.5 disabled:opacity-60"
                >
                    <Link to="/login">Back to Login</Link>
                </button>
            </div>
            </div>
        </AuthLayout>
    );
}