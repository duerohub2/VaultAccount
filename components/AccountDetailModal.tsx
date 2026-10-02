"use client";
import { useEffect, useRef, useState } from "react";
import { X, Eye, Pencil, Copy, Mail, Trash2 } from "lucide-react";
import { Account } from "@/lib/types";
import { fmtDate } from "@/lib/utils";
import { BADGE } from "./AccountListItem";
interface Props { account: Account; onClose: () => void; onEdit: (a: Account) => void; onDelete: (a: Account) => void; onCopy: (t: string, m: string, secret?: boolean) => void; onCycle: (a: Account) => void; }
const ACT = "flex min-h-[44px] flex-col items-center justify-center gap-1 border-2 border-ink bg-card py-2 font-display text-[10px] font-bold uppercase transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5";
export default function AccountDetailModal({ account: a, onClose, onEdit, onDelete, onCopy, onCycle }: Props) {
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  const reveal = () => { setShow(true); clearTimeout(timer.current); timer.current = setTimeout(() => setShow(false), 5000); };
  const row = "flex items-center justify-between gap-3 border-t-2 border-ink py-2.5";
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/70" style={{ animation: "fadeIn .15s" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-[600px] overflow-y-auto border-x-[2.5px] border-t-[2.5px] border-ink bg-bg px-5 pb-8 pt-7" style={{ animation: "slideUp .25s cubic-bezier(.2,.8,.3,1.2)" }}>
        <button className="ico ml-auto" onClick={onClose} aria-label="Tutup"><X size={18} strokeWidth={2.5} /></button>
        <div className="mb-5 flex flex-col items-start gap-3">
          <span className="nb flex h-16 w-16 items-center justify-center bg-accent font-display text-2xl font-bold">{(a.name.trim()[0] ?? "?").toUpperCase()}</span>
          <h2 className="break-words font-display text-[20px] font-bold leading-tight">{a.name}</h2>
          <button className={`badge min-h-[44px] ${BADGE[a.status]}`} onClick={() => onCycle(a)} aria-label="Ganti status">{a.status}</button>
        </div>
        <div className={row}><span className="lbl !mb-0">PASSWORD</span>
          <button className="flex min-h-[44px] items-center gap-2 break-all font-medium" onClick={reveal} aria-label="Tampilkan password">{show ? a.password : "••••••••"}<Eye size={14} /></button></div>
        <div className={row}><span className="lbl !mb-0">EMAIL</span><span className="break-all text-right font-medium">{a.email}</span></div>
        <div className={row}><span className="lbl !mb-0">NO. HP</span>
          <button className="min-h-[44px] font-medium" onClick={() => a.phone && onCopy(a.phone, "Nomor disalin")}>{a.phone || "-"}</button></div>
        <div className={row}><span className="lbl !mb-0">DIBUAT</span><span className="font-medium">{fmtDate(a.createdAt)}</span></div>
        {a.note && <div className="border-t-2 border-ink py-2.5"><span className="lbl">CATATAN</span><p className="whitespace-pre-wrap break-words">{a.note}</p></div>}
        <div className="grid grid-cols-4 gap-1.5 border-t-2 border-ink pt-3.5">
          <button className={`${ACT} active:bg-blue`} onClick={() => { onClose(); onEdit(a); }}><Pencil size={16} strokeWidth={2.5} />EDIT</button>
          <button className={`${ACT} active:bg-accent`} onClick={() => onCopy(a.password, "Password disalin", true)}><Copy size={16} strokeWidth={2.5} />PASS</button>
          <button className={`${ACT} active:bg-green`} onClick={() => onCopy(a.email, "Email disalin")}><Mail size={16} strokeWidth={2.5} />EMAIL</button>
          <button className={`${ACT} active:bg-red`} onClick={() => onDelete(a)}><Trash2 size={16} strokeWidth={2.5} />HAPUS</button>
        </div>
      </div>
    </div>
  );
}
