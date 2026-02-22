"use client";

import { BookCard } from "@/components/books/book-card";
import { Sparkles } from "lucide-react";

export interface AiBookResult {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverImage: string | null;
  availableCopies: number;
  matchReason: string;
  relevanceScore: number;
}

interface AiSearchResultsProps {
  results: AiBookResult[];
  query: string;
}

export function AiSearchResults({ results, query }: AiSearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-1">No matching books found</h3>
        <p className="text-sm">
          Try rephrasing your query or switch to regular search for keyword matching.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        <span>
          {results.length} result{results.length !== 1 && "s"} for &quot;{query}&quot;
        </span>
      </div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {results.map((book) => (
          <div key={book.id} className="space-y-2">
            <BookCard
              id={book.id}
              title={book.title}
              author={book.author}
              genre={book.genre}
              coverImage={book.coverImage}
              availableCopies={book.availableCopies}
            />
            <div className="flex items-start gap-1.5 px-1">
              <Sparkles className="h-3 w-3 mt-0.5 shrink-0 text-muted-foreground" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {book.matchReason}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
