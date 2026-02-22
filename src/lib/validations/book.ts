import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().min(1, "ISBN is required"),
  genre: z.string().min(1, "Genre is required"),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  publicationYear: z.coerce.number().int().min(1000).max(new Date().getFullYear()).optional(),
  totalCopies: z.coerce.number().int().min(1, "Must have at least 1 copy").default(1),
});

export type BookInput = z.infer<typeof bookSchema>;
