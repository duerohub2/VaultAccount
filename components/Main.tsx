"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Lock, Settings, Plus, Pencil, Copy, Mail, Trash2, Search, Eye } from "lucide-react";
import { Account, Status } from "@/lib/types";
import { fmtDate } from "@/lib/utils";
interface Props { accounts: Account[]; onAdd: () => void; onEdit: (a: Account) => void; onDelete: (a: Account) => void; onCopy: (t: string, m: string, secret?: boolean) => void; onCycle: (a: Account) => void; onSettings: () => void; onLock: () => void; }
const FILTERS = ["semua", "aktif", "limit", "block"] as const;
const SORTS = ["terbaru", "terlama", "a-z"] as const;
const BADGE: Record<Status, string> = { aktif: "bg-green text-card", limit: "bg-accent text-ink", block: "bg-red text-card" };
const ACT = "flex min-h-[44px] flex-col items-center justify-center gap-1 border-2 border-ink bg-card py-2 font-display text-[10px] font-bold uppercase transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5";
export default function Main({ accounts, onAdd, onEdit, onDelete, onCopy, onCycle, onSettings, onLock }: Props) {
  const [q, setQ] = useState(""), [fi, setFi] = useState(0), [si, setSi] = useState(0), [shown, setShown] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  const reveal = (id: string) => { setShown(id); clearTimeout(timer.current); timer.current = setTimeout(() => setShown(null), 5000); };
  const f = FILTERS[fi], s = SORTS[si];
  const list = useMemo(() => {
    const r = accounts.filter((a) => (f === "semua" || a.status === f) && `${a.email} ${a.note} ${a.phone}`.toLowerCase().includes(q.toLowerCase()));
    return r.sort((a, b) => s === "terbaru" ? b.createdAt - a.createdAt : s === "terlama" ? a.createdAt - b.createdAt : a.email.localeCompare(b.email));
  }, [accounts, q, f, s]);
  const n = (st: Status) => accounts.filter((a) => a.status === st).length;
  const stats: [string, number][] = [["TOTAL", accounts.length], ["AKTIF", n("aktif")], ["LIMIT", n("limit")], ["BLOCK", n("block")]];
  return (
    <div className="mx-auto max-w-xl pb-32">
      <header className="flex items-center justify-between border-b-[2.5px] border-ink bg-accent px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <div><h1 className="font-display text-2xl font-bold uppercase tracking-[-1px]">VAULT</h1><p className="text-[11px] font-bold uppercase tracking-[1px]">{accounts.length} AKUN</p></div>
        <div className="flex gap-2"><button className="ico" onClick={onSettings} aria-label="Pengaturan"><Settings size={18} strokeWidth={2.5} /></button><button className="ico" onClick={onLock} aria-label="Kunci vault"><Lock size={18} strokeWidth={2.5} /></button></div>
      </header>
      <div className="grid grid-cols-4 gap-2 p-4">{stats.map(([l, v]) => <div key={l} className="nb !shadow-[3px_3px_0_#0A0A0A] p-2 text-center"><div className="font-display text-[22px] font-bold tracking-[-1px]">{v}</div><div className="text-[10px] font-bold uppercase">{l}</div></div>)}</div>
      <div className="flex gap-2 px-4 pb-4">
        <div className="relative flex-1"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" /><input className="inp !pl-9" placeholder="Cari..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari akun" autoCapitalize="off" autoCorrect="off" spellCheck={false} /></div>
        <button className="btn !px-3 text-xs" onClick={() => setFi((fi + 1) % 4)} aria-label="Filter status">{f.toUpperCase()}</button>
      </div>
      <div className="flex items-center justify-between px-4 pb-4">
        <span className="text-[11px] font-bold uppercase tracking-[1px]">{list.length} HASIL</span>
        <button className="btn !px-3 text-xs" onClick={() => setSi((si + 1) % SORTS.length)} aria-label="Ganti urutan">URUT: {s.toUpperCase()}</button>
      </div>
      {list.length === 0 && <div className="px-4 py-12 text-center"><div className="nb mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-accent"><Lock size={28} strokeWidth={2.5} /></div>
        <h2 className="font-display text-xl font-bold uppercase">{accounts.length ? "Gak Ada Hasil" : "Belum Ada Akun"}</h2><p className="mt-1">{accounts.length ? "Coba kata kunci lain." : "Tap tombol + buat nambah akun baru."}</p></div>}
      <div className="space-y-5 px-4">
        {list.map((a, i) => (
          <article key={a.id} className="nb p-4" style={{ animation: `cardIn .25s ${i * 30}ms both cubic-bezier(.2,.8,.3,1.2)` }}>
            <div className="flex items-start justify-between gap-2 pb-3"><h3 className="break-all font-display text-base font-bold">{a.email}</h3>
              <button className={`badge min-h-[44px] ${BADGE[a.status]}`} onClick={() => onCycle(a)} aria-label="Ganti status">{a.status}</button></div>
            <div className="flex items-center justify-between border-t-2 border-ink py-2.5"><span className="lbl !mb-0">PASSWORD</span>
              <button className="flex min-h-[44px] items-center gap-2 break-all font-medium" onClick={() => reveal(a.id)} aria-label="Tampilkan password">{shown === a.id ? a.password : "........"}<Eye size={14} /></button></div>
            <div className="flex items-center justify-between border-t-2 border-ink py-2.5"><span className="lbl !mb-0">NO. HP</span>
              <button className="min-h-[44px] font-medium" onClick={() => a.phone && onCopy(a.phone, "Nomor disalin")}>{a.phone || "-"}</button></div>
            <div className="flex justify-between border-t-2 border-ink py-2.5"><span className="lbl !mb-0">DIBUAT</span><span className="font-medium">{fmtDate(a.createdAt)}</span></div>
            {a.note && <div className="border-t-2 border-ink py-2.5"><span className="lbl !mb-0">CATATAN — </span><span className="whitespace-pre-wrap break-words">{a.note}</span></div>}
            <div className="grid grid-cols-4 gap-1.5 border-t-2 border-ink pt-3.5">
              <button className={`${ACT} active:bg-blue`} onClick={() => onEdit(a)}><Pencil size={16} strokeWidth={2.5} />EDIT</button>
              <button className={`${ACT} active:bg-accent`} onClick={() => onCopy(a.password, "Password disalin", true)}><Copy size={16} strokeWidth={2.5} />PASS</button>
              <button className={`${ACT} active:bg-green`} onClick={() => onCopy(a.email, "Email disalin")}><Mail size={16} strokeWidth={2.5} />EMAIL</button>
              <button className={`${ACT} active:bg-red`} onClick={() => onDelete(a)}><Trash2 size={16} strokeWidth={2.5} />HAPUS</button>
            </div>
          </article>))}
      </div>
      <button onClick={onAdd} aria-label="Tambah akun" className="nb fixed bottom-6 right-5 z-50 flex h-16 w-16 items-center justify-center bg-accent transition-all duration-150 active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"><Plus size={28} strokeWidth={3} /></button>
    </div>
  );
}
