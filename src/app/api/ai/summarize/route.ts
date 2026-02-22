import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateBookSummary } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId } = await req.json();

    if (!bookId) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Return cached summary if exists
    if (book.aiSummary) {
      return NextResponse.json({ summary: book.aiSummary });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "AI service is not configured" },
        { status: 503 }
      );
    }

    const summary = await generateBookSummary(
      book.title,
      book.author,
      book.genre,
      book.description
    );

    // Cache in DB
    await prisma.book.update({
      where: { id: bookId },
      data: { aiSummary: summary },
    });

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("AI summary error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate summary";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
