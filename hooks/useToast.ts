"use client";
import { useCallback, useRef, useState } from "react";
export interface ToastState { id: number; msg: string; type: "success" | "error"; }
export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const show = useCallback((msg: string, type: "success" | "error" = "success") => {
    clearTimeout(timer.current); setToast({ id: Date.now(), msg, type });
    timer.current = setTimeout(() => setToast(null), 2200);
  }, []);
  return { toast, show };
}
