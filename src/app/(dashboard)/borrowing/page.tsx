export const dynamic = "force-dynamic";

import { getBorrowings } from "@/lib/actions/borrowing";
import { auth } from "@/lib/auth";
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
import { ReturnButton } from "@/components/borrowing/return-button";
import { BookCopy } from "lucide-react";
import Link from "next/link";

export default async function BorrowingPage() {
  const session = await auth();
  const borrowings = await getBorrowings();
  const isStaff =
    session?.user?.role === "ADMIN" || session?.user?.role === "LIBRARIAN";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Borrowing</h1>
        <p className="text-muted-foreground">
          {isStaff
            ? "Manage all borrowing records"
            : "View your borrowing history"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Borrowing Records</CardTitle>
        </CardHeader>
        <CardContent>
          {borrowings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookCopy className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No borrowing records</p>
              <p className="text-sm">
                {isStaff
                  ? "No books have been checked out yet"
                  : "You haven't borrowed any books yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    {isStaff && <TableHead>Member</TableHead>}
                    <TableHead>Status</TableHead>
                    <TableHead>Borrowed</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Returned</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowings.map((record) => {
                    const isOverdue =
                      record.status === "BORROWED" &&
                      new Date(record.dueDate) < new Date();

                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          <Link
                            href={`/books/${record.book.id}`}
                            className="hover:underline"
                          >
                            <div>
                              <p className="font-medium">
                                {record.book.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {record.book.author}
                              </p>
                            </div>
                          </Link>
                        </TableCell>
                        {isStaff && (
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {record.user.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {record.user.email}
                              </p>
                            </div>
                          </TableCell>
                        )}
                        <TableCell>
                          <Badge
                            variant={
                              record.status === "RETURNED"
                                ? "secondary"
                                : isOverdue
                                ? "destructive"
                                : "default"
                            }
                          >
                            {isOverdue ? "OVERDUE" : record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(
                            record.borrowedAt
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(record.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {record.returnedAt
                            ? new Date(
                                record.returnedAt
                              ).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {record.status === "BORROWED" && (
                            <ReturnButton borrowingId={record.id} />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
