"use client";
import { useState, useEffect } from "react";
import { getAuth } from "@/lib/api";
import { useToast } from "./Toast";

interface ExpiryItem {
  id: number;
  medicineName: string;
  expiryDate: string;
}

export default function ExpiryTracker() {
  const [items, setItems] = useState<ExpiryItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [show, setShow] = useState(false);
  const [newItem, setNewItem] = useState({ medicineName: "", expiryDate: "" });
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("pillwise-expiry");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const save = (updated: ExpiryItem[]) => {
    setItems(updated);
    localStorage.setItem("pillwise-expiry", JSON.stringify(updated));
  };

  const add = () => {
    if (!newItem.medicineName || !newItem.expiryDate) return;
    const item: ExpiryItem = {
      id: Date.now(),
      medicineName: newItem.medicineName,
      expiryDate: newItem.expiryDate,
    };
    save([...items, item]);
    setNewItem({ medicineName: "", expiryDate: "" });
    setShowAdd(false);
    toast(`${item.medicineName} added to expiry tracker`, "success", "📅");
  };

  const remove = (id: number) => {
    save(items.filter((i) => i.id !== id));
    toast("Removed from expiry tracker", "info", "🗑️");
  };

  const getStatus = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: "Expired", color: "text-red-400 bg-red-500/10 border-red-500/30", emoji: "🔴", days: diffDays };
    if (diffDays <= 30) return { label: `${diffDays} days left`, color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30", emoji: "🟡", days: diffDays };
    if (diffDays <= 90) return { label: `${diffDays} days left`, color: "text-blue-400 bg-blue-500/10 border-blue-500/30", emoji: "🔵", days: diffDays };
    return { label: `${diffDays} days left`, color: "text-green-400 bg-green-500/10 border-green-500/30", emoji: "🟢", days: diffDays };
  };

  const expiredCount = items.filter((i) => getStatus(i.expiryDate).days < 0).length;
  const soonCount = items.filter((i) => { const d = getStatus(i.expiryDate).days; return d >= 0 && d <= 30; }).length;

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setShow(!show)}
        className="w-full p-5 flex items-center justify-between hover:bg-slate-800/30 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border text-2xl ${
            expiredCount > 0 ? "bg-red-500/10 border-red-500/20" : "bg-orange-500/10 border-orange-500/20"
          }`}>
            📅
          </div>
          <div className="text-left">
            <h3 className="font-bold text-white">Expiry Tracker</h3>
            <p className="text-sm text-slate-400">
              {expiredCount > 0 ? `${expiredCount} expired!` : soonCount > 0 ? `${soonCount} expiring soon` : `${items.length} tracked`}
            </p>
          </div>
        </div>
        <span className={`text-slate-500 transition-transform ${show ? "rotate-180" : ""}`}>▼</span>
      </button>

      {show && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-800/50 pt-4">
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="btn-primary w-full py-3 text-white font-medium rounded-xl text-sm"
          >
            {showAdd ? "Cancel" : "+ Add Medicine Expiry"}
          </button>

          {showAdd && (
            <div className="space-y-3 animate-fade-in-up">
              <input
                type="text"
                value={newItem.medicineName}
                onChange={(e) => setNewItem({ ...newItem, medicineName: e.target.value })}
                placeholder="Medicine name"
                className="input-field w-full px-4 py-3 rounded-xl text-white text-sm"
              />
              <input
                type="date"
                value={newItem.expiryDate}
                onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                className="input-field w-full px-4 py-3 rounded-xl text-white text-sm"
              />
              <button
                onClick={add}
                disabled={!newItem.medicineName || !newItem.expiryDate}
                className="btn-primary w-full py-2.5 text-white text-sm font-medium rounded-xl disabled:opacity-50"
              >
                Add
              </button>
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center py-6 text-slate-500">
              <div className="text-4xl mb-2">📅</div>
              <p className="text-sm">No medicines tracked yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items
                .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
                .map((item) => {
                  const status = getStatus(item.expiryDate);
                  return (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl glass-card">
                      <span className="text-lg">{status.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.medicineName}</p>
                        <p className="text-xs text-slate-500">Expires: {new Date(item.expiryDate).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full border font-bold ${status.color}`}>
                        {status.label}
                      </span>
                      <button
                        onClick={() => remove(item.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
