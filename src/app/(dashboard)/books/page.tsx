export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Link from "next/link";
import { getBooks } from "@/lib/actions/books";
import { auth } from "@/lib/auth";
import { BookCard } from "@/components/books/book-card";
import { SearchBar } from "@/components/books/search-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Library } from "lucide-react";

async function BookGrid({ search }: { search?: string }) {
  const books = await getBooks(search);

  if (books.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Library className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-1">No books found</h3>
        <p className="text-sm">
          {search
            ? "Try a different search term"
            : "Add your first book to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {books.map((book) => (
        <BookCard
          key={book.id}
          id={book.id}
          title={book.title}
          author={book.author}
          genre={book.genre}
          coverImage={book.coverImage}
          availableCopies={book.availableCopies}
        />
      ))}
    </div>
  );
}

function BookGridSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  const canManage =
    session?.user?.role === "ADMIN" || session?.user?.role === "LIBRARIAN";
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Books</h1>
          <p className="text-muted-foreground">Browse the library catalog</p>
        </div>
        {canManage && (
          <Link href="/books/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </Button>
          </Link>
        )}
      </div>

      <Suspense>
        <SearchBar />
      </Suspense>

      <Suspense fallback={<BookGridSkeleton />}>
        <BookGrid search={params.q} />
      </Suspense>
    </div>
  );
}
