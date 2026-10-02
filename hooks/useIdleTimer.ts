"use client";
import { useEffect, useRef } from "react";
export function useIdleTimer(active: boolean, onIdle: () => void, ms = 300000) {
  const cb = useRef(onIdle); cb.current = onIdle;
  useEffect(() => {
    if (!active) return;
    let t = setTimeout(() => cb.current(), ms);
    const reset = () => { clearTimeout(t); t = setTimeout(() => cb.current(), ms); };
    const ev = ["pointerdown", "keydown", "touchstart", "scroll"];
    ev.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => { clearTimeout(t); ev.forEach((e) => window.removeEventListener(e, reset)); };
  }, [active, ms]);
}
