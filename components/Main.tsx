"use client";
import { useMemo, useState } from "react";
import { Lock, Settings, Plus, Search } from "lucide-react";
import { Account, Status } from "@/lib/types";
import AccountListItem from "./AccountListItem";
import AccountDetailModal from "./AccountDetailModal";
interface Props { accounts: Account[]; onAdd: () => void; onEdit: (a: Account) => void; onDelete: (a: Account) => void; onCopy: (t: string, m: string, secret?: boolean) => void; onCycle: (a: Account) => void; onSettings: () => void; onLock: () => void; }
const FILTERS = ["semua", "aktif", "limit", "block"] as const;
const SORTS = ["terbaru", "terlama", "a-z"] as const;
export default function Main({ accounts, onAdd, onEdit, onDelete, onCopy, onCycle, onSettings, onLock }: Props) {
  const [q, setQ] = useState(""), [fi, setFi] = useState(0), [si, setSi] = useState(0), [detailId, setDetailId] = useState<string | null>(null);
  const f = FILTERS[fi], s = SORTS[si];
  const list = useMemo(() => {
    const r = accounts.filter((a) => (f === "semua" || a.status === f) && `${a.name} ${a.email} ${a.note} ${a.phone}`.toLowerCase().includes(q.toLowerCase()));
    return r.sort((a, b) => s === "terbaru" ? b.createdAt - a.createdAt : s === "terlama" ? a.createdAt - b.createdAt : a.name.localeCompare(b.name));
  }, [accounts, q, f, s]);
  const detail = accounts.find((a) => a.id === detailId) ?? null;
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
        <div className="relative flex-1"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" /><input className="inp !pl-9" placeholder="Cari nama, email, HP..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari akun" autoCapitalize="off" autoCorrect="off" spellCheck={false} /></div>
        <button className="btn !px-3 text-xs" onClick={() => setFi((fi + 1) % 4)} aria-label="Filter status">{f.toUpperCase()}</button>
      </div>
      <div className="flex items-center justify-between px-4 pb-4">
        <span className="text-[11px] font-bold uppercase tracking-[1px]">{list.length} HASIL</span>
        <button className="btn !px-3 text-xs" onClick={() => setSi((si + 1) % SORTS.length)} aria-label="Ganti urutan">URUT: {s.toUpperCase()}</button>
      </div>
      {list.length === 0 && <div className="px-4 py-12 text-center"><div className="nb mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-accent"><Lock size={28} strokeWidth={2.5} /></div>
        <h2 className="font-display text-xl font-bold uppercase">{accounts.length ? "Gak Ada Hasil" : "Belum Ada Akun"}</h2><p className="mt-1">{accounts.length ? "Coba kata kunci lain." : "Tap tombol + buat nambah akun baru."}</p></div>}
      <div className="space-y-3 px-4">{list.map((a, i) => <AccountListItem key={a.id} account={a} index={i} onOpen={(x) => setDetailId(x.id)} />)}</div>
      {detail && <AccountDetailModal account={detail} onClose={() => setDetailId(null)} onEdit={onEdit} onDelete={onDelete} onCopy={onCopy} onCycle={onCycle} />}
      <button onClick={onAdd} aria-label="Tambah akun" className="nb fixed bottom-6 right-5 z-50 flex h-16 w-16 items-center justify-center bg-accent transition-all duration-150 active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"><Plus size={28} strokeWidth={3} /></button>
    </div>
  );
}
