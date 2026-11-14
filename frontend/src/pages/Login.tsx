import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/auth";
import PasswordInput from "../components/PasswordInput";
import { Spinner } from "../components/Spinner";
import AuthLayout from "../components/AuthLayout";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { checkAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await loginUser({ email, password });
            await checkAuth();
            navigate("/new-note", { replace: true });
        } catch (err: any) {
            const message = err.response?.data?.message || "Failed to connect to server";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="glass-panel relative w-full max-w-md space-y-8 overflow-hidden p-8">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/50 to-transparent" />

                <div className="relative z-10 text-center">
                    <div className="mb-3 flex items-center justify-center gap-2">
                        <span className="orb orb-aqua h-8 w-8" />
                        <span className="text-2xl font-extrabold text-ink">Ledgerly</span>
                    </div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-ink">
                        Sign in to your workspace
                    </h2>
                    <p className="mt-2 text-sm text-ink-soft">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-bold text-aqua-600 transition-colors hover:text-aqua-500"
                        >
                            Create one now
                        </Link>
                    </p>
                </div>

                {error && (
                    <div className="relative z-10 rounded-xl border border-red-300 bg-red-50 p-3 text-center text-sm font-semibold text-red-700">
                        {error}
                    </div>
                )}

                <form className="relative z-10 mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 ml-1 block text-sm font-bold text-ink-soft">
                                Email address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="glass-input block w-full sm:text-sm"
                                placeholder="abc@example.com"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 ml-1 block text-sm font-bold text-ink-soft">
                                Password
                            </label>
                            <PasswordInput
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                        </div>
                        <div className="text-right">
                            <Link to="/forgot-password" className="text-sm font-bold text-aqua-600 transition-colors hover:text-aqua-500">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="btn-gloss flex w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading && <Spinner size={16} />}
                        {isLoading ? "Authenticating..." : "Enter Workspace"}
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
}