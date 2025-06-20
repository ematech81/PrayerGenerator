// bibleStorage.js

import {
  fetchBooks,
  fetchBookById,
  fetchChapterCount,
} from "./utils/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "BIBLE_DATA_v3";
const BOOK_CHAPTER_COUNTS = {
  // ... (your complete hardcoded list from earlier)
};

export const getChapterCount = async (bookId) => {
  // 1. Try hardcoded values first (fastest)
  if (BOOK_CHAPTER_COUNTS[bookId]) {
    return BOOK_CHAPTER_COUNTS[bookId];
  }

  // 2. Try API as fallback
  return await fetchChapterCount(bookId);
};

export const loadBibleData = async () => {
  try {
    // Try local storage first
    const cached = await AsyncStorage.getItem(STORAGE_KEY);
    if (cached) return JSON.parse(cached);

    // Initialize fresh data
    const apiBooks = await fetchBooks();
    const booksWithChapters = await Promise.all(
      apiBooks.map(async (book) => ({
        ...book,
        chapterCount: await getChapterCount(book.id),
      }))
    );

    const bibleData = {
      timestamp: Date.now(),
      books: booksWithChapters,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bibleData));
    return bibleData;
  } catch (error) {
    console.error("Bible data initialization failed:", error);
    throw error;
  }
};
