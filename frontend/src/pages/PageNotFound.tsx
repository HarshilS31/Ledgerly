import { Link } from "react-router-dom";

export default function PageNotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <div className="glass-panel w-full max-w-md space-y-4 p-8 text-center">
                <span className="orb orb-orange mx-auto h-10 w-10" />
                <h1 className="text-4xl font-extrabold text-ink">404</h1>
                <p className="text-sm text-ink-soft">That page doesn't exist.</p>
                <Link to="/new-note" className="btn-gloss inline-block">
                    Back to Ledgerly
                </Link>
            </div>
        </div>
    );
}