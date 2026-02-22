"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, RotateCcw } from "lucide-react";
import { returnBook } from "@/lib/actions/borrowing";

export function ReturnButton({ borrowingId }: { borrowingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleReturn() {
    setLoading(true);
    try {
      const result = await returnBook(borrowingId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Book returned successfully!");
        router.refresh();
      }
    } catch {
      toast.error("Failed to return book");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size="sm" variant="outline" onClick={handleReturn} disabled={loading}>
      {loading ? (
        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
      ) : (
        <RotateCcw className="mr-2 h-3 w-3" />
      )}
      Return
    </Button>
  );
}
