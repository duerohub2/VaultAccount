"use client";
import { ToastState } from "@/hooks/useToast";
export default function Toast({ toast }: { toast: ToastState | null }) {
  if (!toast) return null;
  return (
    <div key={toast.id} role="status" style={{ animation: "toastIn .2s cubic-bezier(.2,.8,.3,1.2)" }}
      className={`fixed bottom-24 left-1/2 z-[200] border-2 border-ink px-5 py-3.5 font-display text-[13px] font-bold uppercase shadow-[4px_4px_0_#FFD93D] ${toast.type === "error" ? "bg-red text-card" : "bg-green text-card"}`}>
      {toast.msg}
    </div>
  );
}
