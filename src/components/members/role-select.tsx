"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateUserRole } from "@/lib/actions/members";
import type { Role } from "@/generated/prisma/client";

interface RoleSelectProps {
  userId: string;
  currentRole: Role;
  isCurrentUser: boolean;
}

export function RoleSelect({
  userId,
  currentRole,
  isCurrentUser,
}: RoleSelectProps) {
  const [loading, setLoading] = useState(false);

  async function handleRoleChange(newRole: string) {
    setLoading(true);
    try {
      const result = await updateUserRole(userId, newRole as Role);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Role updated successfully");
      }
    } catch {
      toast.error("Failed to update role");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Select
      value={currentRole}
      onValueChange={handleRoleChange}
      disabled={loading || isCurrentUser}
    >
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="MEMBER">Member</SelectItem>
        <SelectItem value="LIBRARIAN">Librarian</SelectItem>
        <SelectItem value="ADMIN">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}
