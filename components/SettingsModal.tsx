"use client";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import { fmtDate } from "@/lib/utils";
interface Props {
  total: number; lockMin: number; lastBackup: number | null;
  onLockMin: (m: number) => void; onExport: () => void; onImport: (text: string) => void; onWipe: () => void;
  onChangePw: (o: string, n: string) => Promise<string | null>; onClose: () => void;
}
const LOCKS = [1, 5, 15, 30];
const off = { autoComplete: "off", autoCapitalize: "off", autoCorrect: "off", spellCheck: false } as const;
export default function SettingsModal({ total, lockMin, lastBackup, onLockMin, onExport, onImport, onWipe, onChangePw, onClose }: Props) {
  const file = useRef<HTMLInputElement>(null);
  const [o, setO] = useState(""), [n, setN] = useState("");
  const [msg, setMsg] = useState<{ t: string; ok: boolean } | null>(null);
  const change = async () => {
    const e = await onChangePw(o, n);
    if (e) setMsg({ t: e, ok: false }); else { setMsg({ t: "PASSWORD DIGANTI", ok: true }); setO(""); setN(""); }
  };
  const row = "flex min-h-[44px] items-center justify-between border-b-2 border-ink py-3 font-medium";
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70" style={{ animation: "fadeIn .15s" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-[600px] overflow-y-auto border-x-[2.5px] border-t-[2.5px] border-ink bg-bg px-5 pb-8 pt-7" style={{ animation: "slideUp .25s cubic-bezier(.2,.8,.3,1.2)" }}>
        <button className="ico ml-auto" onClick={onClose} aria-label="Tutup"><X size={18} strokeWidth={2.5} /></button>
        <h2 className="mb-4 font-display text-[26px] font-bold uppercase tracking-[-1px]">Pengaturan</h2>
        <div className={row}>Export backup<button className="btn text-xs" onClick={onExport}>EXPORT</button></div>
        <div className={row}>Import backup<button className="btn text-xs" onClick={() => file.current?.click()}>IMPORT</button></div>
        <input ref={file} type="file" accept="application/json" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) onImport(await f.text()); e.target.value = ""; }} />
        <div className={row}>Backup terakhir<span className="font-display font-bold">{lastBackup ? fmtDate(lastBackup) : "BELUM PERNAH"}</span></div>
        <div className={row}>Total akun<span className="font-display font-bold">{total}</span></div>
        <div className="space-y-3 border-b-2 border-ink py-4">
          <span className="lbl !mb-0">AUTO-LOCK (MENIT)</span>
          <div className="grid grid-cols-4 gap-2">
            {LOCKS.map((m) => <button key={m} className={`btn !px-2 text-xs ${m === lockMin ? "btn-p" : ""}`} onClick={() => onLockMin(m)} aria-pressed={m === lockMin}>{m}</button>)}
          </div>
        </div>
        <div className="space-y-3 border-b-2 border-ink py-4">
          <span className="lbl !mb-0">GANTI MASTER PASSWORD</span>
          <input className="inp" type="password" placeholder="PASSWORD LAMA" value={o} onChange={(e) => setO(e.target.value)} {...off} aria-label="Password lama" />
          <input className="inp" type="password" placeholder="PASSWORD BARU" value={n} onChange={(e) => setN(e.target.value)} {...off} aria-label="Password baru" />
          <button className="btn btn-p w-full text-xs" onClick={change}>GANTI PASSWORD</button>
          {msg && <p role="status" className={`border-[2.5px] border-ink px-3 py-2 font-display text-xs font-bold text-card ${msg.ok ? "bg-green" : "bg-red"}`}>{msg.t}</p>}
        </div>
        <div className="flex min-h-[44px] items-center justify-between pt-3 font-medium">Hapus semua<button className="btn btn-d text-xs" onClick={onWipe}>HAPUS</button></div>
      </div>
    </div>
  );
}
