export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookForm } from "@/components/books/book-form";

export default async function NewBookPage() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "LIBRARIAN"].includes(session.user.role)) {
    redirect("/books");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Book</h1>
        <p className="text-muted-foreground">Add a new book to the catalog</p>
      </div>
      <BookForm />
    </div>
  );
}
