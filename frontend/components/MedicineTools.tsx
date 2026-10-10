"use client";
import { useState, useEffect } from "react";
import { api, Medicine } from "@/lib/api";
import { ShareButton } from "./ShareVoice";
import { useToast } from "./Toast";

// Comparison
export function MedicineComparison({ medicines }: { medicines: Medicine[] }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [show, setShow] = useState(false);
  const [details, setDetails] = useState<any[]>([]);

  const toggle = async (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  useEffect(() => {
    if (selected.length >= 2) {
      Promise.all(selected.map((id) => api.getMedicine(id)))
        .then(setDetails)
        .catch(console.error);
    } else {
      setDetails([]);
    }
  }, [selected]);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-xl">⚖️</span> Compare Medicines
          </h3>
          <p className="text-sm text-slate-400">Select 2-3 medicines to compare</p>
        </div>
        <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
          {selected.length}/3
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {medicines.slice(0, 20).map((med) => (
          <button
            key={med.id}
            onClick={() => toggle(med.id)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              selected.includes(med.id)
                ? "bg-blue-500/20 text-blue-400 border-blue-500/40"
                : "border-slate-700/50 text-slate-400 hover:border-slate-600"
            }`}
          >
            {med.name}
          </button>
        ))}
      </div>

      {details.length >= 2 && (
        <div className="overflow-x-auto -mx-2 px-2 animate-fade-in-up">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-3 px-3 text-slate-400 font-medium">Feature</th>
                {details.map((d) => (
                  <th key={d.medicine.id} className="text-left py-3 px-3 text-white font-semibold">
                    💊 {d.medicine.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareRow label="Generic" data={details} field="genericName" />
              <CompareRow label="Category" data={details} field="categoryName" />
              <CompareRow label="Purpose" data={details} field="purpose" />
              <CompareRow label="Form" data={details} field="form" />
              <CompareRow label="Dosage" data={details} field="dosage" />
              <CompareRow label="Side Effects" data={details} field="sideEffects" />
              <CompareRow label="Price" data={details} field="priceRange" />
              <tr className="border-b border-slate-800/50">
                <td className="py-3 px-3 text-slate-400">Interactions</td>
                {details.map((d) => (
                  <td key={d.medicine.id} className="py-3 px-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      d.interactions?.length > 0 ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"
                    }`}>
                      {d.interactions?.length || 0} found
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CompareRow({ label, data, field }: { label: string; data: any[]; field: string }) {
  return (
    <tr className="border-b border-slate-800/50">
      <td className="py-3 px-3 text-slate-400">{label}</td>
      {data.map((d, i) => (
        <td key={i} className="py-3 px-3 text-slate-300">
          {d.medicine?.[field] || "-"}
        </td>
      ))}
    </tr>
  );
}

// Doctor Mode - Health Report
export function DoctorMode({ userName, userEmail, medicines, familyMembers, warnings }: {
  userName: string;
  userEmail: string;
  medicines: { name: string; dosage?: string; timing?: string }[];
  familyMembers?: { name: string; relation?: string }[];
  warnings?: number;
}) {
  const generateReport = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const w = doc.internal.pageSize.getWidth();
    const m = 20;
    let y = 20;

    // Header
    doc.setFillColor(14, 165, 233);
    doc.rect(0, 0, w, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("PillWise Health Report", m, 15);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleString()}`, m, 25);
    doc.text("CONFIDENTIAL - For Healthcare Provider", w - m, 15, { align: "right" });

    y = 50;
    doc.setTextColor(0, 0, 0);

    // Patient
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("PATIENT INFORMATION", m, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${userName}`, m, y); y += 6;
    doc.text(`Email: ${userEmail}`, m, y); y += 6;
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, m, y); y += 6;
    doc.text(`Active Warnings: ${warnings || 0}`, m, y); y += 12;

    // Medicines
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("CURRENT MEDICATIONS", m, y); y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    if (medicines.length === 0) doc.text("None reported", m, y);
    medicines.forEach((med) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(`• ${med.name} ${med.dosage ? `(${med.dosage})` : ""} ${med.timing ? `- ${med.timing}` : ""}`, m, y);
      y += 6;
    });
    y += 8;

    // Family
    if (familyMembers && familyMembers.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("FAMILY MEDICAL HISTORY", m, y); y += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      familyMembers.forEach((f) => {
        doc.text(`• ${f.name} (${f.relation || "N/A"})`, m, y);
        y += 6;
      });
      y += 8;
    }

    // Notes
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("CLINICAL NOTES", m, y); y += 8;
    doc.setDrawColor(200);
    doc.rect(m, y, w - 2 * m, 50);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Footer
    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`PillWise Health Report | Page ${i}/${pages}`, w / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
    }

    doc.save(`HealthReport_${userName.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <button onClick={generateReport} className="glass-card px-5 py-3 text-sm text-slate-300 hover:text-white rounded-xl flex items-center gap-2 transition-all">
      🩺 Doctor Report
    </button>
  );
}

// Medicine Reminders
export function MedicineReminders({ medicines }: { medicines: { name: string; timing?: string; dosage?: string }[] }) {
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const { toast } = useToast();

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission as NotificationPermission);
    }
    const saved = localStorage.getItem("pillwise-reminders") === "true";
    setEnabled(saved);
  }, []);

  const toggle = async () => {
    if (!enabled) {
      if (!("Notification" in window)) {
        toast("Notifications not supported", "error");
        return;
      }
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm === "granted") {
        setEnabled(true);
        localStorage.setItem("pillwise-reminders", "true");
        scheduleReminders();
        toast("Reminders enabled!", "success", "🔔");
      } else {
        toast("Permission denied", "error");
      }
    } else {
      setEnabled(false);
      localStorage.setItem("pillwise-reminders", "false");
      toast("Reminders disabled", "info");
    }
  };

  const scheduleReminders = () => {
    // Schedule notifications for next 8 hours
    medicines.forEach((med) => {
      const timing = (med.timing || "").toLowerCase();
      let hour = 8; // default

      if (timing.includes("morning")) hour = 7;
      else if (timing.includes("night") || timing.includes("bed")) hour = 22;
      else if (timing.includes("afternoon")) hour = 14;
      else if (timing.includes("evening")) hour = 18;

      const now = new Date();
      const target = new Date();
      target.setHours(hour, 0, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);

      const delay = target.getTime() - now.getTime();
      if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
        setTimeout(() => {
          if (Notification.permission === "granted") {
            new Notification("💊 PillWise Reminder", {
              body: `Time to take ${med.name}${med.dosage ? ` (${med.dosage})` : ""}`,
              icon: "/favicon.ico",
            });
          }
        }, delay);
      }
    });
  };

  return (
    <div className="glass-card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border text-2xl ${
        enabled ? "bg-green-500/10 border-green-500/20" : "bg-slate-800/60 border-slate-700/50"
      }`}>
        🔔
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-white text-sm">Medicine Reminders</h4>
        <p className="text-xs text-slate-400">
          {enabled ? "Reminders are active" : "Get notified when it's time"}
        </p>
      </div>
      <button
        onClick={toggle}
        className={`w-12 h-7 rounded-full transition-all relative ${
          enabled ? "bg-green-500" : "bg-slate-700"
        }`}
      >
        <div className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-all ${
          enabled ? "left-6" : "left-1"
        }`} />
      </button>
    </div>
  );
}

// Print Medicine Card
export function PrintMedicineCard({ userName, medicines, allergies }: {
  userName: string;
  medicines: { name: string; dosage?: string }[];
  allergies?: string;
}) {
  const print = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
      <head>
        <title>PillWise Medicine Card</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
          .card { max-width: 400px; margin: 0 auto; background: white; border: 3px solid #0ea5e9; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #0ea5e9, #6366f1); color: white; padding: 20px; text-align: center; }
          .header h1 { font-size: 24px; }
          .header p { font-size: 12px; opacity: 0.9; }
          .content { padding: 20px; }
          .patient { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
          .patient h2 { font-size: 18px; color: #333; }
          .allergy { background: #fef2f2; border: 1px solid #fecaca; padding: 10px; border-radius: 8px; margin-bottom: 15px; color: #dc2626; font-size: 13px; }
          .med { display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
          .med:last-child { border-bottom: none; }
          .med-name { font-weight: bold; color: #333; font-size: 14px; }
          .med-dose { color: #666; font-size: 12px; margin-left: 5px; }
          .footer { background: #f8fafc; padding: 12px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #eee; }
          @media print { body { background: white; padding: 0; } .card { border: 2px solid #0ea5e9; } }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>💊 PillWise Card</h1>
            <p>Emergency Medicine Information</p>
          </div>
          <div class="content">
            <div class="patient">
              <h2>${userName}</h2>
              <p style="font-size:12px;color:#666;">Generated: ${new Date().toLocaleDateString()}</p>
            </div>
            ${allergies ? `<div class="allergy">⚠️ <strong>ALLERGIES:</strong> ${allergies}</div>` : ""}
            <h3 style="font-size:14px;color:#333;margin-bottom:8px;">Current Medicines:</h3>
            ${medicines.map((m) => `
              <div class="med">
                <span>💊</span>
                <span class="med-name">${m.name}</span>
                <span class="med-dose">${m.dosage || ""}</span>
              </div>
            `).join("")}
          </div>
          <div class="footer">
            ⚠️ In case of emergency, show this card to medical personnel.<br>
            PillWise - Be Wise Before You Take
          </div>
        </div>
        <script>window.onload = () => { window.print(); }</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <button onClick={print} className="glass-card px-5 py-3 text-sm text-slate-300 hover:text-white rounded-xl flex items-center gap-2 transition-all">
      🖨️ Print Card
    </button>
  );
}
