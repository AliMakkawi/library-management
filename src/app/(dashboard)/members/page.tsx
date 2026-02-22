export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getMembers } from "@/lib/actions/members";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InviteDialog } from "@/components/members/invite-dialog";
import { RoleSelect } from "@/components/members/role-select";
import { Users } from "lucide-react";

export default async function MembersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const members = await getMembers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">Manage library members</p>
        </div>
        <InviteDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Members</CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No members found</p>
              <p className="text-sm">Invite members to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Active Borrows</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.name}
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <RoleSelect
                          userId={member.id}
                          currentRole={member.role}
                          isCurrentUser={member.id === session.user.id}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {member._count.borrowings}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(member.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
