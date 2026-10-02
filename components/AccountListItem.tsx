"use client";
import { ChevronRight } from "lucide-react";
import { Account, Status } from "@/lib/types";
export const BADGE: Record<Status, string> = { aktif: "bg-green text-card", limit: "bg-accent text-ink", block: "bg-red text-card" };
interface Props { account: Account; index: number; onOpen: (a: Account) => void; }
export default function AccountListItem({ account: a, index, onOpen }: Props) {
  return (
    <button onClick={() => onOpen(a)} aria-label={`Buka detail ${a.name}`}
      className="nb flex min-h-[60px] w-full items-center gap-3 p-3 text-left transition-all duration-150 active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"
      style={{ animation: `cardIn .25s ${index * 30}ms both cubic-bezier(.2,.8,.3,1.2)` }}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink bg-accent font-display text-base font-bold">{(a.name.trim()[0] ?? "?").toUpperCase()}</span>
      <span className="min-w-0 flex-1 truncate font-display text-[15px] font-bold">{a.name}</span>
      <span className={`badge shrink-0 ${BADGE[a.status]}`}>{a.status}</span>
      <ChevronRight size={20} strokeWidth={2.5} className="shrink-0" />
    </button>
  );
}
