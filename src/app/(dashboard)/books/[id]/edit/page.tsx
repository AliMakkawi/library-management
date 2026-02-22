export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { getBook } from "@/lib/actions/books";
import { auth } from "@/lib/auth";
import { BookForm } from "@/components/books/book-form";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "LIBRARIAN"].includes(session.user.role)) {
    redirect("/books");
  }

  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Book</h1>
        <p className="text-muted-foreground">Update book information</p>
      </div>
      <BookForm book={book} />
    </div>
  );
}
