export const fmtDate = (t: number) => new Date(t).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
export const genPassword = (n = 16) => {
  const c = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
  return Array.from(crypto.getRandomValues(new Uint32Array(n)), (x) => c[x % c.length]).join("");
};
