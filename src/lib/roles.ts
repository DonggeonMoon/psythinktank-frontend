export type Role = "member" | "manager" | "admin";

export const isStaffRole = (role: Role | undefined | null) => role === "manager" || role === "admin";
