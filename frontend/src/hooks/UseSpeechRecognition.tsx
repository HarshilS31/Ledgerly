import { useCallback, useEffect, useRef, useState } from "react";

const getCtor = () =>
    typeof window === "undefined"
        ? undefined
        : (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const BLOCKED = "Microphone access is blocked. Allow it in your browser's site settings.";
const ERRORS: Record<string, string> = {
    "not-allowed": BLOCKED,
    "service-not-allowed": BLOCKED,
    "no-speech": "Didn't catch anything. Try again.",
    "audio-capture": "No microphone found.",
    network: "Couldn't reach the speech service. Check your connection.",
};

export function useSpeechRecognition(onFinal: (text: string) => void, lang?: string) {
    const Ctor = getCtor();
    const recRef = useRef<any>(null);
    const onFinalRef = useRef(onFinal);
    const [listening, setListening] = useState(false);
    const [interim, setInterim] = useState("");
    const [error, setError] = useState("");
    useEffect(() => {
        onFinalRef.current = onFinal;
    }, [onFinal]);

    const start = useCallback(() => {
        if (!Ctor || recRef.current) return;

        const rec = new Ctor();
        rec.lang = lang || navigator.language || "en-US";
        rec.continuous = true;     
        rec.interimResults = true; 

        rec.onstart = () => {
            setError("");
            setListening(true);
        };
        rec.onresult = (e: any) => {
            let live = "";
            for (let i = e.resultIndex; i < e.results.length; i++) {
                const r = e.results[i];
                if (r.isFinal) onFinalRef.current(r[0].transcript);
                else live += r[0].transcript;
            }
            setInterim(live);
        };
        rec.onerror = (e: any) => setError(ERRORS[e.error] ?? "Voice input failed. Try again.");
        rec.onend = () => {
            recRef.current = null;
            setListening(false);
            setInterim("");
        };
        recRef.current = rec;
        rec.start();
    }, [Ctor, lang]);
    const stop = useCallback(() => recRef.current?.stop(), []);
    useEffect(() => () => recRef.current?.abort(), []);

    return { supported: !!Ctor, listening, interim, error, start, stop };
}