"use client";
import { useState } from "react";

export function ShareButton({ title, text, url }: { title: string; text: string; url?: string }) {
  const [show, setShow] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const shareOptions = [
    {
      label: "WhatsApp",
      icon: "💬",
      action: () => {
        const msg = encodeURIComponent(`${title}\n\n${text}\n\n${shareUrl}`);
        window.open(`https://wa.me/?text=${msg}`, "_blank");
      },
    },
    {
      label: "SMS",
      icon: "📱",
      action: () => {
        const msg = encodeURIComponent(`${title}\n${text}\n${shareUrl}`);
        window.open(`sms:?body=${msg}`, "_blank");
      },
    },
    {
      label: "Copy Link",
      icon: "🔗",
      action: () => {
        navigator.clipboard.writeText(`${title}\n${text}\n${shareUrl}`);
        alert("Copied to clipboard!");
      },
    },
    {
      label: "Email",
      icon: "✉️",
      action: () => {
        const subject = encodeURIComponent(title);
        const body = encodeURIComponent(`${text}\n\n${shareUrl}`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
      },
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className="glass-card px-4 py-2 rounded-xl text-slate-300 hover:text-white text-sm flex items-center gap-2 transition-all"
      >
        <span>📤</span> Share
      </button>

      {show && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShow(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 glass-card p-2 min-w-[160px] animate-fade-in-up">
            {shareOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => {
                  opt.action();
                  setShow(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all"
              >
                <span>{opt.icon}</span> {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function VoiceInput({ onResult, placeholder }: { onResult: (text: string) => void; placeholder?: string }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };
    recognition.onerror = () => setListening(false);

    recognition.start();
  };

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={startListening}
      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
        listening
          ? "bg-red-500/20 border border-red-500/50 animate-pulse text-red-400"
          : "glass-card text-slate-400 hover:text-white hover:bg-slate-800/60"
      }`}
      title={listening ? "Listening..." : "Voice search"}
    >
      <span className="text-xl">{listening ? "🎙️" : "🎤"}</span>
    </button>
  );
}
