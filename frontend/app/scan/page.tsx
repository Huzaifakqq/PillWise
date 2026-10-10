"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import PillVisual from "@/components/PillVisual";

// Demo barcode → medicine mapping (real Egyptian/Pakistani OTC codes for demo)
const BARCODE_MAP: Record<string, string> = {
  "8901030895485": "Panadol",
  "8901030500127": "Brufen",
  "8902665123456": "Augmentin",
  "6291103443215": "Nurofen",
  "5000158062123": "Ponstan",
  "8901234567890": "Loprin",
};

declare global {
  interface Window {
    BarcodeDetector?: new (opts?: { formats?: string[] }) => {
      detect: (source: CanvasImageSource) => Promise<{ rawValue: string }[]>;
    };
  }
}

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"idle" | "starting" | "scanning" | "unsupported" | "error">("idle");
  const [scanned, setScanned] = useState<string | null>(null);
  const [match, setMatch] = useState<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("BarcodeDetector" in window) || !navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }
    let raf = 0;
    let stopped = false;

    const start = async () => {
      setStatus("starting");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setStatus("scanning");
        const detector = new window.BarcodeDetector!({ formats: ["ean_13", "ean_8", "upc_a", "code_128"] });

        const tick = async () => {
          if (stopped) return;
          try {
            const codes = await detector.detect(videoRef.current!);
            if (codes.length > 0) {
              const raw = codes[0].rawValue;
              stopped = true;
              setScanned(raw);
              handleCode(raw);
              return;
            }
          } catch {
            /* frame not ready */
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch {
        setStatus("error");
      }
    };
    start();

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCode = async (code: string) => {
    const name = BARCODE_MAP[code];
    if (name) {
      const meds = await api.getMedicines(name);
      if (meds.length > 0) setMatch(meds[0]);
    }
  };

  const manualLookup = async (code: string) => {
    setScanned(code);
    await handleCode(code);
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-grid">
      <header className="glass-card border-0 border-b border-slate-800/50 sticky top-0 z-50 rounded-none">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="w-10 h-10 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">📷 Medicine Scanner</h1>
            <p className="text-xs text-slate-500">Point camera at a medicine box barcode</p>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Camera viewfinder */}
        <div className="glass-card p-2 relative overflow-hidden">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full aspect-[4/3] object-cover rounded-xl bg-slate-900"
          />
          {/* Scan frame overlay */}
          <div className="absolute inset-0 grid place-items-center pointer-events-none" style={{ inset: "8px" }}>
            <div className="relative w-64 h-64">
              {[
                "top-0 left-0 border-t-4 border-l-4 rounded-tl-2xl",
                "top-0 right-0 border-t-4 border-r-4 rounded-tr-2xl",
                "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-2xl",
                "bottom-0 right-0 border-b-4 border-r-4 rounded-br-2xl",
              ].map((c) => (
                <span key={c} className={`absolute w-12 h-12 border-blue-400 ${c}`} />
              ))}
              {status === "scanning" && (
                <span
                  className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                  style={{ animation: "scanline 2s ease-in-out infinite" }}
                />
              )}
            </div>
          </div>

          {status === "starting" && (
            <div className="absolute inset-0 grid place-items-center bg-slate-950/60">
              <p className="text-slate-400 animate-pulse">Starting camera…</p>
            </div>
          )}
          {(status === "unsupported" || status === "error") && (
            <div className="absolute inset-0 grid place-items-center bg-slate-950/80 p-6 text-center">
              <div>
                <div className="text-4xl mb-3">📷</div>
                <p className="text-slate-300 font-medium mb-1">
                  {status === "unsupported" ? "Live scanning needs Chrome/Edge" : "Camera unavailable"}
                </p>
                <p className="text-xs text-slate-500">Use manual codes below to try the demo</p>
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        {scanned && (
          <div className="glass-card p-4 flex items-center gap-3 animate-slide-down">
            <span className="text-xs font-mono bg-slate-800 px-3 py-2 rounded-lg text-blue-300">{scanned}</span>
            {match ? (
              <span className="text-sm text-emerald-400 font-medium">✓ Matched: {match.name}</span>
            ) : (
              <span className="text-sm text-slate-500">No match in database</span>
            )}
          </div>
        )}

        {/* Match card */}
        {match && (
          <button
            onClick={() => router.push(`/medicine/${match.id}`)}
            className="glass-card glass-card-hover p-6 w-full text-left flex items-center gap-5 animate-bounce-in"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl grid place-items-center border border-white/10">
              <PillVisual name={match.name} category={match.categoryName} size={44} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{match.name}</h3>
              <p className="text-sm text-slate-400">{match.genericName || match.purpose}</p>
            </div>
            <span className="text-blue-400">→</span>
          </button>
        )}

        {/* Manual demo codes */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-white mb-1">🎯 Demo Barcodes</h3>
          <p className="text-xs text-slate-500 mb-4">
            Scan these with your phone camera — or tap to simulate a scan
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(BARCODE_MAP).map(([code, name]) => (
              <button
                key={code}
                onClick={() => manualLookup(code)}
                className="bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/40 rounded-xl p-3 text-left transition-all"
              >
                <div className="text-[10px] font-mono text-slate-500 mb-1">{code}</div>
                <div className="text-sm font-semibold text-slate-200">{name}</div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-600">
          Barcodes are mapped for demo purposes. Production would query the full PK-DAR database.
        </p>
      </main>
    </div>
  );
}
