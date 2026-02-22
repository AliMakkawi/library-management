"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";

interface SearchBarProps {
  onAiResults?: (results: unknown[]) => void;
  onAiLoading?: (loading: boolean) => void;
  onAiError?: (error: string | null) => void;
  onAiActiveChange?: (active: boolean) => void;
  onAiQueryChange?: (query: string) => void;
}

export function SearchBar({
  onAiResults,
  onAiLoading,
  onAiError,
  onAiActiveChange,
  onAiQueryChange,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isAiActive, setIsAiActive] = useState(false);
  const isInitial = useRef(true);

  // Regular search: debounced URL param update
  useEffect(() => {
    if (isAiActive) return;

    if (isInitial.current) {
      isInitial.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (query) {
        params.set("q", query);
      }
      router.push(`/books?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, router, isAiActive]);

  function handleToggleAi() {
    const newActive = !isAiActive;
    setIsAiActive(newActive);
    onAiActiveChange?.(newActive);

    if (!newActive) {
      // Switching back to regular: clear AI state, restore URL search
      onAiResults?.([]);
      onAiError?.(null);
      onAiLoading?.(false);
      onAiQueryChange?.("");
      setQuery("");
      router.push("/books");
    } else {
      // Switching to AI: clear the regular URL param
      setQuery("");
      router.push("/books");
    }
  }

  async function handleAiSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;

    onAiQueryChange?.(trimmed);
    onAiLoading?.(true);
    onAiError?.(null);

    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Search failed");
      }

      const data = await res.json();
      onAiResults?.(data.results);
    } catch (err) {
      onAiError?.(err instanceof Error ? err.message : "Search failed");
      onAiResults?.([]);
    } finally {
      onAiLoading?.(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (isAiActive && e.key === "Enter") {
      e.preventDefault();
      handleAiSearch();
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={
              isAiActive
                ? "Describe what you're looking for..."
                : "Search books by title, author, genre, or ISBN..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
          />
        </div>
        <Button
          variant={isAiActive ? "default" : "outline"}
          size="icon"
          onClick={handleToggleAi}
          title={isAiActive ? "Switch to regular search" : "Switch to AI search"}
        >
          <Sparkles className="h-4 w-4" />
        </Button>
        {isAiActive && (
          <Button
            onClick={handleAiSearch}
            disabled={!query.trim()}
          >
            Search
          </Button>
        )}
      </div>
      {isAiActive && (
        <p className="text-xs text-muted-foreground">
          Try: &quot;books about loneliness&quot;, &quot;something uplifting for a rainy day&quot;, &quot;classic adventure stories&quot;
        </p>
      )}
    </div>
  );
}
