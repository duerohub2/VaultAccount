"use client";
import { useState } from "react";
import { Lock } from "lucide-react";
interface Props { creating: boolean; idle: boolean; onSubmit: (pw: string) => Promise<string | null>; }
export default function LockScreen({ creating, idle, onSubmit }: Props) {
  const [pw, setPw] = useState(""), [err, setErr] = useState<string | null>(null), [busy, setBusy] = useState(false);
  const desc = creating ? "Bikin master password dulu. INGAT BAIK-BAIK — kalau lupa, data ilang, gak ada recovery."
    : idle ? "Auto-lock karena idle. Masukkan master password." : "Masukkan master password buat buka vault.";
  const go = async (e: React.FormEvent) => { e.preventDefault(); setBusy(true); setErr(null); setErr(await onSubmit(pw)); setBusy(false); };
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5" style={{ animation: "lockIn .3s cubic-bezier(.2,.8,.3,1.2)" }}>
      <div className="nb mb-6 flex h-16 w-16 items-center justify-center bg-accent"><Lock size={28} strokeWidth={2.5} /></div>
      <h1 className="font-display text-2xl font-bold uppercase tracking-[-1px]">VAULT</h1>
      <p className="mb-6 mt-2">{desc}</p>
      <form onSubmit={go} className="space-y-4">
        <input className="inp" type="password" placeholder="MASTER PASSWORD" value={pw} onChange={(e) => setPw(e.target.value)}
          autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} aria-label="Master password" />
        <button className="btn btn-p w-full" disabled={busy}>{busy ? "MEMBUKA..." : creating ? "BIKIN VAULT" : "BUKA VAULT"}</button>
        {err && <p role="alert" className="border-[2.5px] border-ink bg-red px-3 py-2 font-display text-xs font-bold text-card">{err}</p>}
      </form>
    </main>
  );
}
