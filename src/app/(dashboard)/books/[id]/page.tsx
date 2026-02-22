export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getBook } from "@/lib/actions/books";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DeleteBookButton } from "@/components/books/delete-book-button";
import { CheckoutDialog } from "@/components/borrowing/checkout-dialog";
import { AiSummarySection } from "@/components/books/ai-summary-section";
import { Pencil, ArrowLeft } from "lucide-react";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  const session = await auth();
  const canManage =
    session?.user?.role === "ADMIN" || session?.user?.role === "LIBRARIAN";
  const isAvailable = book.availableCopies > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/books">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cover Image */}
        <div className="lg:col-span-1">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <div className="text-center p-6">
                  <p className="text-2xl font-semibold">{book.title}</p>
                  <p className="text-lg mt-2">{book.author}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl font-bold">{book.title}</h1>
                <p className="text-lg text-muted-foreground mt-1">
                  by {book.author}
                </p>
              </div>
              {canManage && (
                <div className="flex gap-2">
                  <Link href={`/books/${book.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <DeleteBookButton bookId={book.id} />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="outline">{book.genre}</Badge>
              {book.publicationYear && (
                <Badge variant="outline">{book.publicationYear}</Badge>
              )}
              <Badge variant={isAvailable ? "default" : "destructive"}>
                {isAvailable
                  ? `${book.availableCopies} of ${book.totalCopies} available`
                  : "No copies available"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">ISBN</p>
              <p className="font-medium">{book.isbn}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Copies</p>
              <p className="font-medium">{book.totalCopies}</p>
            </div>
          </div>

          {book.description && (
            <>
              <Separator />
              <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {book.description}
                </p>
              </div>
            </>
          )}

          <Separator />

          <div className="flex gap-3">
            {isAvailable && session?.user && (
              <CheckoutDialog bookId={book.id} bookTitle={book.title} />
            )}
          </div>

          {/* AI Summary */}
          <AiSummarySection
            bookId={book.id}
            aiSummary={book.aiSummary}
            canManage={canManage}
          />

          {/* Active Borrowings */}
          {canManage && book.borrowings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Active Borrowings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {book.borrowings.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>
                        {b.user.name} ({b.user.email})
                      </span>
                      <span className="text-muted-foreground">
                        Due: {new Date(b.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
