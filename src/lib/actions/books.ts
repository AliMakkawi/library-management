"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { bookSchema, type BookInput } from "@/lib/validations/book";
import { revalidatePath } from "next/cache";

export async function getBooks(search?: string) {
  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { author: { contains: search, mode: "insensitive" as const } },
          { genre: { contains: search, mode: "insensitive" as const } },
          { isbn: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  return prisma.book.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function getBook(id: string) {
  return prisma.book.findUnique({
    where: { id },
    include: {
      borrowings: {
        where: { status: "BORROWED" },
        include: {
          user: { select: { name: true, email: true } },
        },
      },
    },
  });
}

export async function createBook(data: BookInput) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "LIBRARIAN"].includes(session.user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    const validated = bookSchema.parse(data);

    const existing = await prisma.book.findUnique({
      where: { isbn: validated.isbn },
    });
    if (existing) {
      return { error: "A book with this ISBN already exists" };
    }

    await prisma.book.create({
      data: {
        ...validated,
        availableCopies: validated.totalCopies,
      },
    });

    revalidatePath("/books");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to create book" };
  }
}

export async function updateBook(id: string, data: BookInput) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "LIBRARIAN"].includes(session.user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    const validated = bookSchema.parse(data);

    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) {
      return { error: "Book not found" };
    }

    const existingIsbn = await prisma.book.findUnique({
      where: { isbn: validated.isbn },
    });
    if (existingIsbn && existingIsbn.id !== id) {
      return { error: "A book with this ISBN already exists" };
    }

    // Adjust available copies based on total copies change
    const copiesDiff = validated.totalCopies - book.totalCopies;
    const newAvailable = Math.max(0, book.availableCopies + copiesDiff);

    await prisma.book.update({
      where: { id },
      data: {
        ...validated,
        availableCopies: newAvailable,
      },
    });

    revalidatePath("/books");
    revalidatePath(`/books/${id}`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to update book" };
  }
}

export async function deleteBook(id: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "LIBRARIAN"].includes(session.user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    const activeBorrowings = await prisma.borrowingRecord.count({
      where: { bookId: id, status: "BORROWED" },
    });

    if (activeBorrowings > 0) {
      return { error: "Cannot delete a book with active borrowings" };
    }

    await prisma.book.delete({ where: { id } });
    revalidatePath("/books");
    return { success: true };
  } catch {
    return { error: "Failed to delete book" };
  }
}
