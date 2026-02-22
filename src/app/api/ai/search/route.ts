import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { searchBooksWithAI } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { query } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    if (query.length > 500) {
      return NextResponse.json(
        { error: "Search query is too long (max 500 characters)" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "AI service is not configured" },
        { status: 503 }
      );
    }

    // Fetch all books with lightweight select (exclude heavy/irrelevant fields)
    const books = await prisma.book.findMany({
      select: {
        id: true,
        title: true,
        author: true,
        genre: true,
        description: true,
        publicationYear: true,
        availableCopies: true,
        coverImage: true,
        isbn: true,
        totalCopies: true,
      },
    });

    // Build catalog for AI (exclude coverImage and other non-semantic fields)
    const catalog = books.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      genre: b.genre,
      description: b.description,
      publicationYear: b.publicationYear,
      availableCopies: b.availableCopies,
    }));

    const aiResults = await searchBooksWithAI(query.trim(), catalog);

    // Build a lookup map for enrichment and hallucination filtering
    const bookMap = new Map(books.map((b) => [b.id, b]));

    const results = aiResults
      .filter((r) => bookMap.has(r.bookId))
      .map((r) => ({
        ...bookMap.get(r.bookId)!,
        matchReason: r.matchReason,
        relevanceScore: r.relevanceScore,
      }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("AI search error:", error);
    return NextResponse.json(
      { error: "Something went wrong while searching. Please try again later." },
      { status: 500 }
    );
  }
}
