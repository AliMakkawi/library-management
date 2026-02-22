import { GoogleGenerativeAI } from "@google/generative-ai";

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

export async function generateBookSummary(
  title: string,
  author: string,
  genre: string,
  description?: string | null
): Promise<string> {
  const model = getModel();

  const prompt = `You are a helpful librarian. Generate a concise, engaging summary (2-3 paragraphs) for the following book. Focus on themes, writing style, and who would enjoy it. Do not include spoilers.

Title: ${title}
Author: ${author}
Genre: ${genre}
${description ? `Description: ${description}` : ""}

Summary:`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

export interface AiSearchResult {
  bookId: string;
  matchReason: string;
  relevanceScore: number;
}

export interface BookCatalogEntry {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string | null;
  publicationYear: number | null;
  availableCopies: number;
}

export async function searchBooksWithAI(
  query: string,
  catalog: BookCatalogEntry[]
): Promise<AiSearchResult[]> {
  const model = getModel();

  const prompt = `You are a librarian search engine. You receive a book catalog as JSON and a natural language search query from a user. Your job is to find the most relevant books that match the query.

Consider themes, topics, mood, genre, author style, and any other semantic meaning in the query. Rank results by relevance.

Book catalog:
${JSON.stringify(catalog)}

User query: "${query}"

Return ONLY a JSON array of matching books, with no other text. Each element must have:
- "bookId": the exact id from the catalog
- "matchReason": a short explanation (1-2 sentences) of why this book matches the query
- "relevanceScore": a number from 0 to 1 indicating relevance

Only include books that are genuinely relevant. If no books match, return an empty array [].
Return valid JSON only, no markdown fences or extra text.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown code fences if Gemini wraps the output
  const cleaned = text.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");

  return JSON.parse(cleaned) as AiSearchResult[];
}
