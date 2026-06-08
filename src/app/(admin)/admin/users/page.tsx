"use client";

import { UserTable } from "@/components/admin/UserTable";

export default function AdminUsersPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage user accounts, roles, and access.
        </p>
      </div>
      <UserTable />
    </div>
  );
}
