"use client";
import { Interaction } from "./api";

const LAST_CHECK_KEY = "pillwise_last_check";

export interface LastCheck {
  medicines: { id: number; name: string; dosage?: string }[];
  results: Interaction[];
  checkedAt: string;
}

export function saveLastCheck(data: LastCheck) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LAST_CHECK_KEY, JSON.stringify(data));
  } catch {
    // storage full / private mode — fail silently, this is a fail-safe only
  }
}

export function loadLastCheck(): LastCheck | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_CHECK_KEY);
    return raw ? (JSON.parse(raw) as LastCheck) : null;
  } catch {
    return null;
  }
}

export function isOffline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

/**
 * Registers the service worker that keeps the app usable when the network
 * drops mid-demo. Returns a cleanup-free no-op on unsupported browsers.
 */
export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  if (process.env.NODE_ENV !== "production") return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // SW is a progressive enhancement; never block the app on failure
    });
  });
}
