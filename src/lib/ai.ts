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
