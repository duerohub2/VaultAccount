export type Status = "aktif" | "limit" | "block";
export interface Account { id: string; name: string; email: string; password: string; phone: string; status: Status; note: string; createdAt: number; updatedAt: number; }
export type AccountInput = Pick<Account, "name" | "email" | "password" | "phone" | "status" | "note">;
