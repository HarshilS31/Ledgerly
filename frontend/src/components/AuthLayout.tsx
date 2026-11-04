import type { ReactNode } from "react";
const bubbles = [
    { size: 340, style: { top: "-8%", left: "-5%" }, delay: "0s", dur: "16s" },
    { size: 220, style: { bottom: "-6%", left: "18%" }, delay: "-4s", dur: "13s" },
    { size: 280, style: { top: "8%", right: "-6%" }, delay: "-8s", dur: "18s" },
    { size: 140, style: { bottom: "12%", right: "10%" }, delay: "-2s", dur: "11s" },
    { size: 90, style: { top: "42%", left: "42%" }, delay: "-6s", dur: "10s" },
];
const orbs = [
    { cls: "orb-aqua", size: 44, style: { top: "16%", left: "8%" }, delay: "-3s", dur: "9s" },
    { cls: "orb-green", size: 28, style: { bottom: "22%", left: "6%" }, delay: "-5s", dur: "8s" },
    { cls: "orb-orange", size: 36, style: { bottom: "14%", right: "34%" }, delay: "-1s", dur: "10s" },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* animated background */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
                {bubbles.map((b, i) => (
                    <span
                        key={i}
                        className="absolute animate-float rounded-full border border-white/40 bg-gradient-to-br from-white/40 to-white/5 motion-reduce:animate-none"
                        style={{ width: b.size, height: b.size, ...b.style, animationDelay: b.delay, animationDuration: b.dur }}
                    />
                ))}
                {orbs.map((o, i) => (
                    <span
                        key={i}
                        className={`orb ${o.cls} absolute animate-float motion-reduce:animate-none`}
                        style={{ width: o.size, height: o.size, ...o.style, animationDelay: o.delay, animationDuration: o.dur }}
                    />
                ))}
            </div>
            <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2">
                <div className="text-center lg:text-left">
                    <p className="text-lg font-bold text-ink-soft sm:text-xl">Welcome to</p>
                    <h1 className="bg-gradient-to-r from-ink to-aqua-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
                        Ledgerly
                    </h1>
                    <p className="mx-auto mt-4 max-w-md text-base font-semibold text-ink-soft sm:text-lg lg:mx-0">
                       Turn messy notes into clear action items.
                    </p>
                </div>

                <div className="flex justify-center lg:justify-end">{children}</div>
            </div>
        </div>
    );
}