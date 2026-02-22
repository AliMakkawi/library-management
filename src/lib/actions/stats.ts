"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getDashboardStats() {
  const session = await auth();
  const isStaff =
    session?.user?.role === "ADMIN" || session?.user?.role === "LIBRARIAN";

  if (isStaff) {
    const [totalBooks, totalMembers, borrowedBooks, overdueBooks] =
      await Promise.all([
        prisma.book.count(),
        prisma.user.count(),
        prisma.borrowingRecord.count({
          where: { status: "BORROWED" },
        }),
        prisma.borrowingRecord.count({
          where: {
            status: "BORROWED",
            dueDate: { lt: new Date() },
          },
        }),
      ]);

    return { totalBooks, totalMembers, borrowedBooks, overdueBooks, isStaff };
  }

  // Member: personal stats
  const userId = session!.user.id;
  const [totalBooks, myBorrowed, myOverdue] = await Promise.all([
    prisma.book.count(),
    prisma.borrowingRecord.count({
      where: { userId, status: "BORROWED" },
    }),
    prisma.borrowingRecord.count({
      where: {
        userId,
        status: "BORROWED",
        dueDate: { lt: new Date() },
      },
    }),
  ]);

  return {
    totalBooks,
    totalMembers: null,
    borrowedBooks: myBorrowed,
    overdueBooks: myOverdue,
    isStaff,
  };
}

export async function getRecentBorrowings() {
  const session = await auth();
  const isStaff =
    session?.user?.role === "ADMIN" || session?.user?.role === "LIBRARIAN";

  return prisma.borrowingRecord.findMany({
    take: 5,
    orderBy: { borrowedAt: "desc" },
    where: isStaff ? {} : { userId: session!.user.id },
    include: {
      user: { select: { name: true, email: true } },
      book: { select: { title: true, author: true } },
    },
  });
}
