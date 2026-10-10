"use client";
import { useState } from "react";
import { useToast } from "./Toast";

interface CardResult {
  medicine1Name: string;
  medicine2Name: string;
  severity: string;
}

export function ShareCardButton({
  results,
  userName,
}: {
  results: CardResult[];
  userName?: string;
}) {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const severityColor = (s: string) =>
    s === "Dangerous" ? "#ef4444" : s === "Mild" || s === "Major" ? "#f59e0b" : "#10b981";

  const generate = async () => {
    setGenerating(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d")!;
      const dangerous = results.filter((r) => r.severity === "Dangerous").length;
      const accent = dangerous > 0 ? "#ef4444" : "#10b981";

      // Background
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, 1080, 1080);

      // Glow orbs
      const orb = (x: number, y: number, r: number, color: string) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, color);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      };
      orb(150, 120, 320, "rgba(14,165,233,0.28)");
      orb(950, 900, 360, "rgba(99,102,241,0.22)");

      // Outer border card
      ctx.strokeStyle = "rgba(100,116,139,0.45)";
      ctx.lineWidth = 3;
      roundRect(ctx, 50, 50, 980, 980, 40);
      ctx.stroke();
      ctx.fillStyle = "rgba(15,23,42,0.75)";
      roundRect(ctx, 50, 50, 980, 980, 40);
      ctx.fill();

      // Header
      ctx.fillStyle = "#0ea5e9";
      roundRect(ctx, 90, 100, 64, 64, 16);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 40px Arial";
      ctx.fillText("P", 110, 148);

      ctx.fillStyle = "#f1f5f9";
      ctx.font = "bold 44px Arial";
      ctx.fillText("PillWise", 176, 132);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "22px Arial";
      ctx.fillText("BE WISE BEFORE YOU TAKE", 176, 162);

      // Result count headline
      ctx.textAlign = "center";
      ctx.fillStyle = accent;
      ctx.font = "bold 56px Arial";
      ctx.fillText(
        dangerous > 0 ? `${dangerous} DANGEROUS Interactions!` : "All Safe ✓",
        540,
        270
      );
      ctx.fillStyle = "#94a3b8";
      ctx.font = "28px Arial";
      ctx.fillText(
        dangerous > 0 ? "Consult your doctor before taking these together" : "These medicines work well together",
        540,
        315
      );

      // Result rows
      const shown = results.slice(0, 4);
      let y = 380;
      shown.forEach((r) => {
        ctx.fillStyle = "rgba(30,41,59,0.85)";
        roundRect(ctx, 100, y, 880, 110, 20);
        ctx.fill();
        ctx.fillStyle = severityColor(r.severity);
        ctx.fillRect(100, y, 10, 110);

        ctx.textAlign = "left";
        ctx.fillStyle = "#f1f5f9";
        ctx.font = "bold 30px Arial";
        ctx.fillText(`${r.medicine1Name}  +  ${r.medicine2Name}`, 140, y + 48);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "24px Arial";
        const severityLabel = r.severity === "Dangerous" ? "Avoid — see your doctor" : r.severity === "Mild" || r.severity === "Major" ? "Take with care" : "Generally safe";
        ctx.fillText(severityLabel, 140, y + 85);

        ctx.fillStyle = severityColor(r.severity);
        roundRect(ctx, 800, y + 30, 150, 50, 25);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 22px Arial";
        ctx.textAlign = "center";
        ctx.fillText(r.severity, 875, y + 63);
        y += 130;
      });

      if (results.length > 4) {
        ctx.textAlign = "center";
        ctx.fillStyle = "#64748b";
        ctx.font = "26px Arial";
        ctx.fillText(`+ ${results.length - 4} more pairs checked`, 540, y + 10);
        y += 40;
      }

      // Footer
      ctx.textAlign = "center";
      ctx.fillStyle = "#64748b";
      ctx.font = "24px Arial";
      ctx.fillText(
        `${userName ? `Checked by ${userName} • ` : ""}${new Date().toLocaleDateString()} • pillwise.pk`,
        540,
        960
      );
      ctx.fillStyle = "#475569";
      ctx.font = "20px Arial";
      ctx.fillText("Not medical advice — always consult a healthcare professional", 540, 995);

      // Download
      const link = document.createElement("a");
      link.download = `pillwise-check-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast("Result card saved — share it on WhatsApp!", "success", "🖼️");
    } catch (err) {
      console.error(err);
      toast("Could not generate card", "error", "❌");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={generate}
      disabled={generating || results.length === 0}
      aria-label="Download a shareable image card of these results"
      className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20"
    >
      {generating ? (
        <span className="animate-spin-slow inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
      ) : (
        <span>🖼️</span>
      )}
      Share Card
    </button>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
