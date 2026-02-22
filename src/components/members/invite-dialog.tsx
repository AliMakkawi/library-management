"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, UserPlus, Copy, Check } from "lucide-react";
import { createInvitation } from "@/lib/actions/members";
import type { Role } from "@/generated/prisma/client";

export function InviteDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [role, setRole] = useState<Role>("MEMBER");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setInviteLink(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const result = await createInvitation(email, role);
      if (result.error) {
        toast.error(result.error);
      } else if (result.token) {
        const link = `${window.location.origin}/register?token=${result.token}`;
        setInviteLink(link);
        toast.success("Invitation created!");
      }
    } catch {
      toast.error("Failed to create invitation");
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (inviteLink) {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) {
      setInviteLink(null);
      setCopied(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite New Member</DialogTitle>
          <DialogDescription>
            Create an invitation link for a new team member.
          </DialogDescription>
        </DialogHeader>

        {inviteLink ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Invitation Link</Label>
              <div className="flex gap-2">
                <Input value={inviteLink} readOnly className="text-xs" />
                <Button size="icon" variant="outline" onClick={copyLink}>
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This link will expire in 7 days.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  name="email"
                  type="email"
                  placeholder="user@example.com"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={role}
                  onValueChange={(v) => setRole(v as Role)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEMBER">Member</SelectItem>
                    <SelectItem value="LIBRARIAN">Librarian</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Invitation
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
