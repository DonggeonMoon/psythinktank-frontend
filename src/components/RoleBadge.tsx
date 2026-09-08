import * as React from "react";
import {isStaffRole, type Role} from "../lib/roles";

const StaffBadge: React.FC = () => (
    <span
        title="운영진"
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-600"
    >
        <svg viewBox="0 0 24 24" fill="white" className="h-2.5 w-2.5">
            <path d="M5 19h14v2H5v-2zm0-2 1.6-8.4L10 12l2-5 2 5 3.4-3.4L19 17H5z"/>
        </svg>
    </span>
);

const RoleBadge: React.FC<{ role?: Role | null }> = ({role}) => {
    if (!isStaffRole(role)) return null;
    return <StaffBadge/>;
};

export default RoleBadge;
