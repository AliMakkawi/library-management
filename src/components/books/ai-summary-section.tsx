"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

interface AiSummarySectionProps {
  bookId: string;
  aiSummary: string | null;
  canManage: boolean;
}

export function AiSummarySection({
  bookId,
  aiSummary,
  canManage,
}: AiSummarySectionProps) {
  const [summary, setSummary] = useState(aiSummary);
  const [loading, setLoading] = useState(false);

  async function generateSummary() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to generate summary");
        return;
      }

      setSummary(data.summary);
      toast.success("AI summary generated!");
    } catch {
      toast.error("Failed to generate summary");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4" />
          AI Summary
        </CardTitle>
        {!summary && canManage && (
          <Button size="sm" variant="outline" onClick={generateSummary} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-3 w-3" />
            )}
            Generate Summary
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {summary ? (
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {summary}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No AI summary available yet.
            {canManage && " Click the button above to generate one."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
