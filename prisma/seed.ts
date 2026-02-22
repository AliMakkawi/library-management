import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const books = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    genre: "Fiction",
    description: "A gripping, heart-wrenching tale of racial injustice in the Deep South, seen through the eyes of a young girl.",
    publicationYear: 1960,
    totalCopies: 3,
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    genre: "Science Fiction",
    description: "A dystopian masterpiece about totalitarianism, surveillance, and the power of language to shape reality.",
    publicationYear: 1949,
    totalCopies: 4,
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "9780141439518",
    genre: "Romance",
    description: "A witty and romantic novel about the Bennet family and the proud Mr. Darcy.",
    publicationYear: 1813,
    totalCopies: 2,
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    genre: "Fiction",
    description: "A portrait of the Jazz Age and the American Dream through the mysterious Jay Gatsby.",
    publicationYear: 1925,
    totalCopies: 3,
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "9780547928227",
    genre: "Fantasy",
    description: "Bilbo Baggins embarks on an unexpected journey with a group of dwarves to reclaim their homeland.",
    publicationYear: 1937,
    totalCopies: 5,
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    isbn: "9780441013593",
    genre: "Science Fiction",
    description: "An epic saga of politics, religion, and ecology on the desert planet Arrakis.",
    publicationYear: 1965,
    totalCopies: 3,
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "9780316769488",
    genre: "Fiction",
    description: "The iconic story of teenage alienation and loss of innocence, narrated by Holden Caulfield.",
    publicationYear: 1951,
    totalCopies: 2,
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    isbn: "9780060850524",
    genre: "Science Fiction",
    description: "A chilling vision of a future society controlled by technology, conditioning, and pleasure.",
    publicationYear: 1932,
    totalCopies: 3,
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    isbn: "9780307474278",
    genre: "Thriller",
    description: "A thrilling mystery involving secret societies, religious history, and hidden codes in famous artworks.",
    publicationYear: 2003,
    totalCopies: 4,
  },
  {
    title: "Gone Girl",
    author: "Gillian Flynn",
    isbn: "9780307588371",
    genre: "Mystery",
    description: "A dark, twisted tale of a marriage gone terribly wrong with shocking revelations.",
    publicationYear: 2012,
    totalCopies: 3,
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    isbn: "9780062316097",
    genre: "Non-Fiction",
    description: "An exploration of how Homo sapiens came to dominate the world through cognitive, agricultural, and scientific revolutions.",
    publicationYear: 2011,
    totalCopies: 4,
  },
  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    isbn: "9781451648539",
    genre: "Biography",
    description: "The definitive biography of Apple co-founder Steve Jobs, based on exclusive interviews.",
    publicationYear: 2011,
    totalCopies: 2,
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    isbn: "9780553380163",
    genre: "Science",
    description: "A landmark book exploring black holes, the Big Bang, and the nature of time itself.",
    publicationYear: 1988,
    totalCopies: 3,
  },
  {
    title: "The Shining",
    author: "Stephen King",
    isbn: "9780307743657",
    genre: "Horror",
    description: "A family's winter stay at an isolated hotel turns into a terrifying nightmare.",
    publicationYear: 1977,
    totalCopies: 2,
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "9780735211292",
    genre: "Self-Help",
    description: "A practical guide to building good habits and breaking bad ones through small changes.",
    publicationYear: 2018,
    totalCopies: 5,
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    isbn: "9780062315007",
    genre: "Fiction",
    description: "A philosophical tale about a shepherd's journey to find his personal legend.",
    publicationYear: 1988,
    totalCopies: 3,
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    isbn: "9780374533557",
    genre: "Psychology",
    description: "Nobel laureate Daniel Kahneman reveals the two systems that drive the way we think.",
    publicationYear: 2011,
    totalCopies: 3,
  },
  {
    title: "The Art of War",
    author: "Sun Tzu",
    isbn: "9781590302255",
    genre: "Philosophy",
    description: "An ancient Chinese military treatise that remains relevant for strategy and leadership.",
    publicationYear: -500,
    totalCopies: 2,
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    genre: "Technology",
    description: "A handbook of agile software craftsmanship with practical advice for writing better code.",
    publicationYear: 2008,
    totalCopies: 4,
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    isbn: "9780307887894",
    genre: "Business",
    description: "A methodology for developing businesses and products through validated learning.",
    publicationYear: 2011,
    totalCopies: 3,
  },
  {
    title: "Hamlet",
    author: "William Shakespeare",
    isbn: "9780743477123",
    genre: "Drama",
    description: "Shakespeare's greatest tragedy about the Prince of Denmark's quest for revenge.",
    publicationYear: 1603,
    totalCopies: 2,
  },
  {
    title: "Where the Wild Things Are",
    author: "Maurice Sendak",
    isbn: "9780064431781",
    genre: "Children",
    description: "A beloved children's classic about Max's imaginative journey to the land of Wild Things.",
    publicationYear: 1963,
    totalCopies: 3,
  },
  {
    title: "The Road",
    author: "Cormac McCarthy",
    isbn: "9780307387899",
    genre: "Fiction",
    description: "A haunting post-apocalyptic journey of a father and son through a devastated America.",
    publicationYear: 2006,
    totalCopies: 2,
  },
  {
    title: "Educated",
    author: "Tara Westover",
    isbn: "9780399590504",
    genre: "Biography",
    description: "A memoir about a woman who grows up in a survivalist family and eventually earns a PhD from Cambridge.",
    publicationYear: 2018,
    totalCopies: 3,
  },
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    isbn: "9780525559474",
    genre: "Fiction",
    description: "A novel about a library between life and death where each book offers a different life you could have lived.",
    publicationYear: 2020,
    totalCopies: 4,
  },
];

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@library.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@library.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Create librarian user
  const librarianPassword = await bcrypt.hash("librarian123", 12);
  await prisma.user.upsert({
    where: { email: "librarian@library.com" },
    update: {},
    create: {
      name: "Sarah Librarian",
      email: "librarian@library.com",
      password: librarianPassword,
      role: "LIBRARIAN",
    },
  });

  // Create member user
  const memberPassword = await bcrypt.hash("member123", 12);
  await prisma.user.upsert({
    where: { email: "member@library.com" },
    update: {},
    create: {
      name: "John Member",
      email: "member@library.com",
      password: memberPassword,
      role: "MEMBER",
    },
  });

  // Create books
  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {},
      create: {
        ...book,
        availableCopies: book.totalCopies,
        coverImage: `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`,
      },
    });
  }

  console.log("Seed completed!");
  console.log("Admin login: admin@library.com / admin123");
  console.log("Librarian login: librarian@library.com / librarian123");
  console.log("Member login: member@library.com / member123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
