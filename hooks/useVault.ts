"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Account, AccountInput, Status } from "@/lib/types";
import { b64, unb64, deriveKey, encrypt, decrypt, Payload } from "@/lib/crypto";
const SALT = "vault_salt_v1", DATA = "vault_data_v1";
export function useVault() {
  const key = useRef<CryptoKey | null>(null);
  const [ready, setReady] = useState(false), [hasVault, setHasVault] = useState(false);
  const [unlocked, setUnlocked] = useState(false), [idle, setIdle] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  useEffect(() => {
    if (!window.crypto?.subtle || !crypto.randomUUID) { alert("Browser tidak didukung"); return; }
    setHasVault(!!localStorage.getItem(SALT)); setReady(true);
  }, []);
  const save = useCallback(async (list: Account[]) => {
    if (!key.current) return;
    localStorage.setItem(DATA, JSON.stringify(await encrypt(key.current, list))); setAccounts(list);
  }, []);
  const unlock = async (pw: string): Promise<string | null> => {
    if (pw.length < 4) return "PASSWORD MINIMAL 4 KARAKTER";
    try {
      if (!hasVault) {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        key.current = await deriveKey(pw, salt); localStorage.setItem(SALT, b64(salt));
        await save([]); setHasVault(true);
      } else {
        const k = await deriveKey(pw, unb64(localStorage.getItem(SALT) ?? ""));
        const raw = localStorage.getItem(DATA);
        const list = raw ? await decrypt<Account[]>(k, JSON.parse(raw) as Payload) : [];
        key.current = k; setAccounts(list);
      }
      setIdle(false); setUnlocked(true); return null;
    } catch { return "PASSWORD SALAH ATAU DATA RUSAK"; }
  };
  const lock = (auto = false) => { key.current = null; setAccounts([]); setUnlocked(false); setIdle(auto); };
  const add = (a: AccountInput) => { const t = Date.now(); return save([{ ...a, id: crypto.randomUUID(), createdAt: t, updatedAt: t }, ...accounts]); };
  const update = (id: string, a: AccountInput) => save(accounts.map((x) => (x.id === id ? { ...x, ...a, updatedAt: Date.now() } : x)));
  const remove = (id: string) => save(accounts.filter((x) => x.id !== id));
  const wipe = () => save([]);
  const exportJson = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(accounts, null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = `vault-backup-${Date.now()}.json`; a.click(); URL.revokeObjectURL(url);
  };
  const importJson = async (text: string): Promise<number> => {
    const parsed: unknown = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("format");
    const st: Status[] = ["aktif", "limit", "block"], t = Date.now();
    const items: Account[] = parsed.filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null && typeof (x as Record<string, unknown>).email === "string")
      .map((x) => ({ id: crypto.randomUUID(), email: String(x.email), password: String(x.password ?? ""), phone: String(x.phone ?? ""),
        status: st.includes(x.status as Status) ? (x.status as Status) : "aktif", note: String(x.note ?? ""),
        createdAt: typeof x.createdAt === "number" ? x.createdAt : t, updatedAt: t }));
    await save([...items, ...accounts]); return items.length;
  };
  const changePassword = async (oldPw: string, newPw: string): Promise<string | null> => {
    if (newPw.length < 4) return "PASSWORD BARU MINIMAL 4 KARAKTER";
    try {
      await decrypt<Account[]>(await deriveKey(oldPw, unb64(localStorage.getItem(SALT) ?? "")), JSON.parse(localStorage.getItem(DATA) ?? "{}") as Payload);
    } catch { return "PASSWORD LAMA SALAH"; }
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const k = await deriveKey(newPw, salt);
    const payload = await encrypt(k, accounts);
    localStorage.setItem(DATA, JSON.stringify(payload)); localStorage.setItem(SALT, b64(salt)); key.current = k;
    return null;
  };
  return { ready, hasVault, unlocked, idle, accounts, unlock, lock, add, update, remove, wipe, exportJson, importJson, changePassword };
}
