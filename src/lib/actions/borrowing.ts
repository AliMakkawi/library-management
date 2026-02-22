"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function checkoutBook(bookId: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return { error: "Book not found" };
    }

    if (book.availableCopies <= 0) {
      return { error: "No copies available" };
    }

    // Check if user already has this book borrowed
    const existing = await prisma.borrowingRecord.findFirst({
      where: {
        userId: session.user.id,
        bookId,
        status: "BORROWED",
      },
    });

    if (existing) {
      return { error: "You already have this book checked out" };
    }

    // Create borrowing record and decrement available copies
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks

    await prisma.$transaction([
      prisma.borrowingRecord.create({
        data: {
          userId: session.user.id,
          bookId,
          dueDate,
        },
      }),
      prisma.book.update({
        where: { id: bookId },
        data: { availableCopies: { decrement: 1 } },
      }),
    ]);

    revalidatePath("/books");
    revalidatePath(`/books/${bookId}`);
    revalidatePath("/borrowing");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Failed to check out book" };
  }
}

export async function returnBook(borrowingId: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    const borrowing = await prisma.borrowingRecord.findUnique({
      where: { id: borrowingId },
    });

    if (!borrowing) {
      return { error: "Borrowing record not found" };
    }

    if (borrowing.status === "RETURNED") {
      return { error: "This book has already been returned" };
    }

    // Only allow the borrower, admins, or librarians to return
    if (
      borrowing.userId !== session.user.id &&
      !["ADMIN", "LIBRARIAN"].includes(session.user.role)
    ) {
      return { error: "Unauthorized" };
    }

    await prisma.$transaction([
      prisma.borrowingRecord.update({
        where: { id: borrowingId },
        data: {
          status: "RETURNED",
          returnedAt: new Date(),
        },
      }),
      prisma.book.update({
        where: { id: borrowing.bookId },
        data: { availableCopies: { increment: 1 } },
      }),
    ]);

    revalidatePath("/books");
    revalidatePath(`/books/${borrowing.bookId}`);
    revalidatePath("/borrowing");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Failed to return book" };
  }
}

export async function getBorrowings() {
  const session = await auth();
  if (!session?.user) {
    return [];
  }

  const where =
    session.user.role === "ADMIN" || session.user.role === "LIBRARIAN"
      ? {}
      : { userId: session.user.id };

  return prisma.borrowingRecord.findMany({
    where,
    orderBy: { borrowedAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      book: { select: { title: true, author: true, id: true } },
    },
  });
}
