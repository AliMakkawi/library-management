export const dynamic = "force-dynamic";

import { getDashboardStats, getRecentBorrowings } from "@/lib/actions/stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Library, BookCopy, AlertTriangle, Users } from "lucide-react";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const recentBorrowings = await getRecentBorrowings();

  const statCards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: Library,
      description: "Books in the catalog",
    },
    {
      title: stats.isStaff ? "Checked Out" : "My Borrowings",
      value: stats.borrowedBooks,
      icon: BookCopy,
      description: stats.isStaff ? "Currently borrowed" : "Books you have",
    },
    {
      title: stats.isStaff ? "Overdue" : "My Overdue",
      value: stats.overdueBooks,
      icon: AlertTriangle,
      description: stats.isStaff ? "Past due date" : "Return soon",
    },
    ...(stats.isStaff
      ? [
          {
            title: "Members",
            value: stats.totalMembers,
            icon: Users,
            description: "Registered users",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {stats.isStaff
            ? "Overview of your library system"
            : "Your library activity"}
        </p>
      </div>

      <div
        className={`grid gap-4 sm:grid-cols-2 ${
          stats.isStaff ? "lg:grid-cols-4" : "lg:grid-cols-3"
        }`}
      >
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {stats.isStaff ? "Recent Borrowings" : "My Recent Borrowings"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentBorrowings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookCopy className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No borrowing records yet</p>
              <p className="text-sm">
                {stats.isStaff
                  ? "Borrowings will appear here once books are checked out"
                  : "Check out a book to see your borrowings here"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  {stats.isStaff && <TableHead>Member</TableHead>}
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBorrowings.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{record.book.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.book.author}
                        </p>
                      </div>
                    </TableCell>
                    {stats.isStaff && (
                      <TableCell>
                        <div>
                          <p className="font-medium">{record.user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {record.user.email}
                          </p>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge
                        variant={
                          record.status === "BORROWED"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(record.dueDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
