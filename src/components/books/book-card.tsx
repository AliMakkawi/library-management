"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverImage: string | null;
  availableCopies: number;
}

export function BookCard({ id, title, author, genre, coverImage, availableCopies }: BookCardProps) {
  const isAvailable = availableCopies > 0;

  return (
    <Link
      href={`/books/${id}`}
      className="group block h-full rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[2/3] bg-muted">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <div className="text-center p-4">
              <p className="text-lg font-semibold">{title}</p>
              <p className="text-sm mt-1">{author}</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold leading-tight line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1">{author}</p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {genre}
          </Badge>
          <Badge variant={isAvailable ? "default" : "destructive"} className="text-xs">
            {isAvailable ? `${availableCopies} available` : "Unavailable"}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
