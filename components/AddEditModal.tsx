"use client";
import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { Account, AccountInput, Status } from "@/lib/types";
import { genPassword } from "@/lib/utils";
interface Props { initial: Account | null; onSave: (a: AccountInput) => void; onClose: () => void; }
const off = { autoComplete: "off", autoCapitalize: "off", autoCorrect: "off", spellCheck: false } as const;
export default function AddEditModal({ initial, onSave, onClose }: Props) {
  const [f, setF] = useState<AccountInput>({ email: initial?.email ?? "", password: initial?.password ?? "", phone: initial?.phone ?? "", status: initial?.status ?? "aktif", note: initial?.note ?? "" });
  const [showPw, setShowPw] = useState(false);
  const set = <K extends keyof AccountInput>(k: K, v: AccountInput[K]) => setF((p) => ({ ...p, [k]: v }));
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/70" style={{ animation: "fadeIn .15s" }} onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); onSave(f); }}
        className="max-h-[92vh] w-full max-w-[600px] overflow-y-auto border-x-[2.5px] border-t-[2.5px] border-ink bg-bg px-5 pb-8 pt-7" style={{ animation: "slideUp .25s cubic-bezier(.2,.8,.3,1.2)" }}>
        <button type="button" className="ico ml-auto" onClick={onClose} aria-label="Tutup"><X size={18} strokeWidth={2.5} /></button>
        <h2 className="mb-5 font-display text-[26px] font-bold uppercase tracking-[-1px]">{initial ? "Edit Akun" : "Tambah Akun"}</h2>
        <div className="space-y-4">
          <div><label className="lbl">EMAIL</label><input className="inp" type="email" inputMode="email" placeholder="nama@gmail.com" value={f.email} onChange={(e) => set("email", e.target.value)} {...off} /></div>
          <div><label className="lbl">PASSWORD</label>
            <div className="flex gap-2">
              <input className="inp min-w-0" type={showPw ? "text" : "password"} value={f.password} onChange={(e) => set("password", e.target.value)} {...off} />
              <button type="button" className="ico shrink-0" onClick={() => setShowPw(!showPw)} aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}>{showPw ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}</button>
              <button type="button" className="btn shrink-0 !px-3 text-xs" onClick={() => { set("password", genPassword()); setShowPw(true); }}>GENERATE</button>
            </div></div>
          <div><label className="lbl">NOMOR HP</label><input className="inp" type="tel" inputMode="tel" placeholder="08xxx" value={f.phone} onChange={(e) => set("phone", e.target.value)} {...off} /></div>
          <div><label className="lbl">STATUS</label><select className="inp" value={f.status} onChange={(e) => set("status", e.target.value as Status)}><option value="aktif">AKTIF</option><option value="limit">LIMIT</option><option value="block">BLOCK</option></select></div>
          <div><label className="lbl">CATATAN</label><textarea className="inp" rows={3} value={f.note} onChange={(e) => set("note", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3 pt-2"><button type="button" className="btn" onClick={onClose}>BATAL</button><button className="btn btn-p">SIMPAN</button></div>
        </div>
      </form>
    </div>
  );
}
