type Props = { size?: number; className?: string };

export function Spinner({ size = 24, className = "" }: Props) {
    return (
        <span
            role="status"
            aria-label="Loading"
            style={{ width: size, height: size }}
            className={`inline-block animate-spin rounded-full border-[3px] border-white/70 border-t-aqua-500 shadow-card ${className}`}
        />
    );
}


export function FullScreenLoader() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="glass-panel flex items-center gap-3 px-6 py-4">
                <Spinner size={22} />
                <span className="text-sm font-bold text-ink-soft">Loading...</span>
            </div>
        </div>
    );
}