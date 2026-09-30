export type Role = "member" | "manager" | "admin" | "bot";

export const isStaffRole = (role: Role | undefined | null) => role === "manager" || role === "admin";

export const hasCrownBadge = (role: Role | undefined | null) => isStaffRole(role) || role === "bot";

export const ROLE_LABEL: Record<Role, string> = {
    member: "회원",
    manager: "매니저",
    admin: "관리자",
    bot: "봇",
};
