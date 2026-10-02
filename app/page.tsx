"use client";
import { useEffect, useState } from "react";
import { Account, AccountInput, Status } from "@/lib/types";
import { useVault } from "@/hooks/useVault";
import { useToast } from "@/hooks/useToast";
import { useIdleTimer } from "@/hooks/useIdleTimer";
import LockScreen from "@/components/LockScreen";
import Main from "@/components/Main";
import AddEditModal from "@/components/AddEditModal";
import SettingsModal from "@/components/SettingsModal";
import Toast from "@/components/Toast";
type Modal = null | "add" | "set" | Account;
const NEXT: Record<Status, Status> = { aktif: "limit", limit: "block", block: "aktif" };
const LOCK_KEY = "vault_autolock_v1", BACKUP_KEY = "vault_lastbackup_v1", LOCK_OPTIONS = [1, 5, 15, 30];
export default function Page() {
  const v = useVault(), { toast, show } = useToast();
  const [modal, setModal] = useState<Modal>(null);
  const [lockMin, setLockMin] = useState(5), [lastBackup, setLastBackup] = useState<number | null>(null);
  useEffect(() => {
    try {
      const m = Number(localStorage.getItem(LOCK_KEY));
      if (LOCK_OPTIONS.includes(m)) setLockMin(m);
      const b = Number(localStorage.getItem(BACKUP_KEY));
      if (b > 0) setLastBackup(b);
    } catch { /* abaikan */ }
  }, []);
  useIdleTimer(v.unlocked, () => { setModal(null); v.lock(true); }, lockMin * 60000);
  if (!v.ready) return null;
  if (!v.unlocked) return <LockScreen creating={!v.hasVault} idle={v.idle} onSubmit={async (pw) => { const e = await v.unlock(pw); if (!e) show("Vault terbuka"); return e; }} />;
  const copy = async (t: string, m: string, secret = false) => {
    try {
      await navigator.clipboard.writeText(t); show(m);
      if (secret) setTimeout(() => { navigator.clipboard.writeText("").catch(() => undefined); }, 30000);
    } catch { show("Gagal salin", "error"); }
  };
  const save = async (a: AccountInput) => {
    if (!a.email.trim()) return show("Email wajib diisi", "error");
    if (!a.password) return show("Password wajib diisi", "error");
    if (modal && typeof modal === "object") { await v.update(modal.id, a); show("Akun diupdate"); } else { await v.add(a); show("Akun ditambah"); }
    setModal(null);
  };
  const changeLock = (m: number) => {
    setLockMin(m);
    try { localStorage.setItem(LOCK_KEY, String(m)); } catch { /* abaikan */ }
    show(`Auto-lock ${m} menit`);
  };
  const doExport = () => {
    v.exportJson();
    const t = Date.now(); setLastBackup(t);
    try { localStorage.setItem(BACKUP_KEY, String(t)); } catch { /* abaikan */ }
    show("Backup didownload");
  };
  return (
    <>
      <Main accounts={v.accounts} onAdd={() => setModal("add")} onEdit={setModal} onSettings={() => setModal("set")} onLock={() => v.lock()} onCopy={copy}
        onCycle={async (a) => { await v.update(a.id, { ...a, status: NEXT[a.status] }); show(`Status: ${NEXT[a.status].toUpperCase()}`); }}
        onDelete={async (a) => { if (confirm(`Hapus akun ${a.email}?`)) { await v.remove(a.id); show("Akun dihapus"); } }} />
      {(modal === "add" || (modal && typeof modal === "object")) && <AddEditModal initial={typeof modal === "object" ? modal : null} onSave={save} onClose={() => setModal(null)} />}
      {modal === "set" && <SettingsModal total={v.accounts.length} lockMin={lockMin} lastBackup={lastBackup} onLockMin={changeLock} onChangePw={v.changePassword} onClose={() => setModal(null)}
        onExport={doExport}
        onImport={async (t) => { try { show(`${await v.importJson(t)} akun diimport`); } catch { show("Gagal import", "error"); } }}
        onWipe={async () => { if (confirm("Hapus SEMUA akun? Gak bisa dibalikin.")) { await v.wipe(); show("Semua akun dihapus"); } }} />}
      <Toast toast={toast} />
    </>
  );
}
