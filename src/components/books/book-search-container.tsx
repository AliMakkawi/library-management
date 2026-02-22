"use client";

import { useState, type ReactNode } from "react";
import { SearchBar } from "@/components/books/search-bar";
import { AiSearchResults, type AiBookResult } from "@/components/books/ai-search-results";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

function AiSearchSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-muted-foreground animate-pulse" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface BookSearchContainerProps {
  children: ReactNode;
}

export function BookSearchContainer({ children }: BookSearchContainerProps) {
  const [aiResults, setAiResults] = useState<AiBookResult[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isAiActive, setIsAiActive] = useState(false);
  const [aiQuery, setAiQuery] = useState("");

  const hasAiResults = isAiActive && !aiLoading && !aiError && aiQuery;

  return (
    <>
      <SearchBar
        onAiResults={(results) => setAiResults(results as AiBookResult[])}
        onAiLoading={setAiLoading}
        onAiError={setAiError}
        onAiActiveChange={setIsAiActive}
        onAiQueryChange={setAiQuery}
      />

      {isAiActive && aiLoading && <AiSearchSkeleton />}

      {isAiActive && aiError && (
        <div className="text-center py-16 text-muted-foreground">
          <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-1">Search failed</h3>
          <p className="text-sm">{aiError}</p>
        </div>
      )}

      {hasAiResults && (
        <AiSearchResults results={aiResults} query={aiQuery} />
      )}

      {!isAiActive && children}
    </>
  );
}
