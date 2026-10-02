export type Status = "aktif" | "limit" | "block";
export interface Account { id: string; email: string; password: string; phone: string; status: Status; note: string; createdAt: number; updatedAt: number; }
export type AccountInput = Pick<Account, "email" | "password" | "phone" | "status" | "note">;
