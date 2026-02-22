"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, BookCopy } from "lucide-react";
import { checkoutBook } from "@/lib/actions/borrowing";

interface CheckoutDialogProps {
  bookId: string;
  bookTitle: string;
}

export function CheckoutDialog({ bookId, bookTitle }: CheckoutDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  async function handleCheckout() {
    setLoading(true);
    try {
      const result = await checkoutBook(bookId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Book checked out successfully!");
        setOpen(false);
        router.refresh();
      }
    } catch {
      toast.error("Failed to check out book");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <BookCopy className="mr-2 h-4 w-4" />
          Check Out
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Check Out Book</DialogTitle>
          <DialogDescription>
            You are about to check out &quot;{bookTitle}&quot;. The book will be
            due on{" "}
            <span className="font-semibold">
              {dueDate.toLocaleDateString()}
            </span>{" "}
            (14 days).
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleCheckout} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
