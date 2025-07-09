import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LANGUAGES } from "../constant/BibleTranslations";
import GeneratedScreen from "../screens/GeneratedScreen";
// https://cors-anywhere.herokuapp.com/
// Base API configuration
const bibleApi = axios.create({
  baseURL: "https://bible-go-api.rkeplin.com/v1",
  // baseURL: "https://bible-go-api.rkeplin.com/v1",
  timeout: 10000, // 10 seconds timeout
});

const API_KEY = "	0fa135365f869592295024b88278f67c";
const apiBible = axios.create({
  baseURL: "https://api.scripture.api.bible/v1",
  headers: { "api-key": API_KEY },
});

// Cache key constants
const BOOKS_CACHE_KEY = "bible_books_cache";
const CACHE_EXPIRY_DAYS = 7; // Cache expiry in days

const BOOK_CHAPTER_COUNTS = {
  // Old Testament (39 books)
  1: 50, // Genesis
  2: 40, // Exodus
  3: 27, // Leviticus
  4: 36, // Numbers
  5: 34, // Deuteronomy
  6: 24, // Joshua
  7: 21, // Judges
  8: 4, // Ruth
  9: 31, // 1 Samuel
  10: 24, // 2 Samuel
  11: 22, // 1 Kings
  12: 25, // 2 Kings
  13: 29, // 1 Chronicles
  14: 36, // 2 Chronicles
  15: 10, // Ezra
  16: 13, // Nehemiah
  17: 10, // Esther
  18: 42, // Job
  19: 150, // Psalms
  20: 31, // Proverbs
  21: 12, // Ecclesiastes
  22: 8, // Song of Solomon
  23: 66, // Isaiah
  24: 52, // Jeremiah
  25: 5, // Lamentations
  26: 48, // Ezekiel
  27: 12, // Daniel
  28: 14, // Hosea
  29: 3, // Joel
  30: 9, // Amos
  31: 1, // Obadiah
  32: 4, // Jonah
  33: 7, // Micah
  34: 3, // Nahum
  35: 3, // Habakkuk
  36: 3, // Zephaniah
  37: 2, // Haggai
  38: 14, // Zechariah
  39: 4, // Malachi

  // New Testament (27 books)
  40: 28, // Matthew
  41: 16, // Mark
  42: 24, // Luke
  43: 21, // John
  44: 28, // Acts
  45: 16, // Romans
  46: 16, // 1 Corinthians
  47: 13, // 2 Corinthians
  48: 6, // Galatians
  49: 6, // Ephesians
  50: 4, // Philippians
  51: 4, // Colossians
  52: 5, // 1 Thessalonians
  53: 3, // 2 Thessalonians
  54: 6, // 1 Timothy
  55: 4, // 2 Timothy
  56: 3, // Titus
  57: 1, // Philemon
  58: 13, // Hebrews
  59: 5, // James
  60: 5, // 1 Peter
  61: 3, // 2 Peter
  62: 5, // 1 John
  63: 1, // 2 John
  64: 1, // 3 John
  65: 1, // Jude
  66: 22, // Revelation
};

export const fetchChapterCount = async (bookId) => {
  try {
    // Try to get from our hardcoded list first
    if (BOOK_CHAPTER_COUNTS[bookId]) {
      return BOOK_CHAPTER_COUNTS[bookId];
    }

    // Fallback: Fetch the last chapter from API
    const response = await bibleApi.get(`/books/${bookId}/chapters/last`);
    return response.data.chapterId;
  } catch (error) {
    console.error(`Error fetching chapter count for book ${bookId}:`, error);
    return 1; // Minimum fallback
  }
};

/**
 * Fetches all Bible books from API or cache
 * @returns {Promise<Array>} Array of Bible books
 */
export const fetchBooks = async () => {
  try {
    // First try to get from cache
    const cachedData = await getCachedBooks();
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, fetch from API
    const response = await bibleApi.get("/books");
    const books = response.data;

    // Cache the books
    await cacheBooks(books);

    return books;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

/**
 * Fetches a specific book by ID
 * @param {number} bookId
 * @returns {Promise<Object>} Book details
 */
export const fetchBookById = async (bookId) => {
  try {
    const response = await bibleApi.get(`/books/${bookId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching book ${bookId}:`, error);
    throw error;
  }
};

/**
 * Fetches a specific chapter of a book
 * @param {number} bookId
 * @param {number} chapterId
 * @returns {Promise<Object>} Chapter details
 */

// function to fetch chapters
export const fetchChapter = async (
  bookId,
  chapterId,
  currentLanguage = "en"
) => {
  const selectedLang = LANGUAGES[currentLanguage];

  try {
    // ✅ For Local Language using API.Bible
    if (selectedLang?.api === "apiBible") {
      const passageId = `${bookId}.${chapterId}`;
      const verses = await fetchVersesFromApiBible(
        selectedLang.bibleId,
        passageId
      );

      return {
        id: `${bookId}-${chapterId}`,
        book: { id: bookId, name: bookId, testament: "OT" }, // You can improve this with actual name if needed
        chapterId,
        verses: [verses], // maintain array-of-array format for compatibility
      };
    }

    // ✅ For English (default)
    const response = await bibleApi.get(
      `/books/${bookId}/chapters/${chapterId}`
    );

    return {
      id: response.data.id,
      book: response.data.book,
      chapterId: response.data.chapterId,
      verses: response.data.verses || [response.data],
    };
  } catch (error) {
    console.error(
      `❌ Error fetching chapter ${chapterId} of book ${bookId}:`,
      error
    );
    throw error;
  }
};

/**
 * Fetches a specific verse
 * @param {number} bookId
 * @param {number} chapterId
 * @param {number} verseId
 * @returns {Promise<Object>} Verse details
 */
export const fetchVerse = async (bookId, chapterId, verseId) => {
  try {
    const response = await bibleApi.get(
      `/books/${bookId}/chapters/${chapterId}/${verseId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching verse ${verseId} of chapter ${chapterId} in book ${bookId}:`,
      error
    );
    throw error;
  }
};

// Add this new function if you need to fetch ALL

export const fetchAllTranslations = async () => {
  try {
    const response = await axios.get(
      "https://bible-go-api.rkeplin.com/v1/translations",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data) {
      throw new Error("Empty response received");
    }

    return response.data;
  } catch (error) {
    console.error("[ERROR] Failed to fetch translations:", {
      error: error.message,
      code: error.code,
      // config: {
      //   url: error.config?.url,
      //   method: error.config?.method,
      // },
      response: error.response?.data,
    });
    throw error;
  }
};

// ✅ For local languages: Yoruba, Igbo, Hausa
export const fetchVersesFromApiBible = async (bibleId, passageId) => {
  try {
    const response = await apiBible.get(
      `/bibles/${bibleId}/passages/${passageId}`,
      {
        params: {
          "content-type": "json",
          "include-chapter-numbers": true,
          "include-verse-numbers": true,
        },
      }
    );

    const content = response.data.data?.content || [];

    const formattedVerses = [];
    let currentVerseId = null;
    let currentText = "";

    for (const block of content) {
      if (block.name === "para" && Array.isArray(block.items)) {
        for (const item of block.items) {
          if (item.name === "verse" && item.attrs?.number) {
            // Push previous verse before starting new one
            if (currentVerseId && currentText.trim()) {
              formattedVerses.push({
                id: String(currentVerseId),
                verseId: String(currentVerseId),
                verseNumber: String(currentVerseId),
                text: currentText.replace(/\s+/g, " ").trim(),
              });
              currentText = "";
            }
            currentVerseId = item.attrs.number;
          }

          if (item.type === "text" && item.text) {
            currentText += item.text + " ";
          }
        }
      }
    }

    // Push last verse
    if (currentVerseId && currentText.trim()) {
      formattedVerses.push({
        id: String(currentVerseId),
        verseId: String(currentVerseId),
        verseNumber: String(currentVerseId),
        text: currentText.replace(/\s+/g, " ").trim(),
      });
    }

    return formattedVerses;
  } catch (error) {
    // console.error("❌ Failed to fetch local language verses:", error);
    return [];
  }
};

export const fetchVersesForTranslation = async (
  translationCode,
  bookId,
  chapter
) => {
  const selectedLang = LANGUAGES[translationCode];

  // ✅ Local Language API logic
  if (selectedLang?.api === "apiBible") {
    const passageId = `${bookId}.${chapter}`; // e.g. GEN.1

    try {
      const verses = await fetchVersesFromApiBible(
        selectedLang.bibleId,
        passageId
      );
      console.log(
        "✅ Local language verses fetched:",
        verses?.length,
        verses?.slice(0, 3)
      );
      return verses;
    } catch (err) {
      console.error("❌ Error fetching local language verses:", err);
      return [];
    }
  }

  // ✅ English API logic (default)
  try {
    const response = await axios.get(
      `https://bible-go-api.rkeplin.com/v1/books/${bookId}/chapters/${chapter}?translation=${translationCode}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data.verses)) return response.data.verses;

    console.warn("⚠️ Unexpected structure", response.data);
    return [];
  } catch (error) {
    // console.error("❌ Error fetching English verses:", error);
    return [];
  }
};

// bibleService.js (your existing English API)
export const fetchEnglishBooks = async () => {
  const response = await axios.get("https://bible-go-api.rkeplin.com/v1/books");
  return response.data; // Your current format
};

// multilingualService.js (new API.Bible integration)

export const fetchBibleBooks = async (languageCode = "en") => {
  if (languageCode === "en") {
    const englishBooks = await fetchEnglishBooks();
    return englishBooks; // Already has testament field
  }

  const bibleId = LANGUAGES[languageCode]?.bibleId;
  const response = await apiBible.get(`/bibles/${bibleId}/books`);
  return transformApiBibleBooks(response.data.data, languageCode);
};

const transformApiBibleBooks = (apiBibleBooks, languageCode) => {
  return apiBibleBooks.map((book) => ({
    id: book.id,
    name: book.name, // For Igbo, Yoruba, Hausa, etc.
    abbreviation: book.abbreviation || book.name?.slice(0, 3), // fallback
    testament:
      languageCode === "en"
        ? book.testament || guessTestamentFromId(book.id)
        : undefined, // Local languages won't use it
    chapterCount: Array.isArray(book.chapters) ? book.chapters.length : 0, // avoid fake fallback
  }));
};

const guessTestamentFromId = (id) => {
  const otBookIds = [
    "GEN",
    "EXO",
    "LEV",
    "NUM",
    "DEU",
    "JOS",
    "JDG",
    "RUT",
    "1SA",
    "2SA",
    "1KI",
    "2KI",
    "1CH",
    "2CH",
    "EZR",
    "NEH",
    "EST",
    "JOB",
    "PSA",
    "PRO",
    "ECC",
    "SNG",
    "ISA",
    "JER",
    "LAM",
    "EZK",
    "DAN",
    "HOS",
    "JOL",
    "AMO",
    "OBA",
    "JON",
    "MIC",
    "NAM",
    "HAB",
    "ZEP",
    "HAG",
    "ZEC",
    "MAL",
  ];
  return otBookIds.includes(id) ? "OT" : "NT";
};

export const fetchChaptersForBook = async (languageCode, bookId) => {
  try {
    if (languageCode === "en") {
      throw new Error("English does not use dynamic chapter fetching");
    }

    const bibleId = LANGUAGES[languageCode]?.bibleId;
    if (!bibleId) {
      throw new Error("No Bible ID found for language:", languageCode);
    }

    const response = await apiBible.get(
      `/bibles/${bibleId}/books/${bookId}/chapters`
    );
    const chapters = response.data.data.filter((ch) => ch.number !== "intro");

    return chapters.map((ch) => ({
      chapterId: parseInt(ch.number),
      bookId: ch.bookId,
    }));
  } catch (error) {
    console.error("Failed to fetch chapters for book:", error);
    throw error;
  }
};

// Helper function to cache books
const cacheBooks = async (books) => {
  try {
    const cacheData = {
      timestamp: new Date().getTime(),
      data: books,
    };
    await AsyncStorage.setItem(BOOKS_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Error caching books:", error);
  }
};

// Helper function to get cached books
const getCachedBooks = async () => {
  try {
    const cachedData = await AsyncStorage.getItem(BOOKS_CACHE_KEY);
    if (!cachedData) return null;

    const parsedData = JSON.parse(cachedData);
    const now = new Date().getTime();
    const isExpired =
      now - parsedData.timestamp > CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    if (isExpired) {
      await AsyncStorage.removeItem(BOOKS_CACHE_KEY);
      return null;
    }

    return parsedData.data;
  } catch (error) {
    console.error("Error getting cached books:", error);
    return null;
  }
};

// api/youtube.js
const YOUTUBE_API_KEY = "AIzaSyBnFFG6FByM4wgmUx7ZscbezehgvbDFYPU";
const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

// Common fetch function with error handling
const fetchYouTubeData = async (params) => {
  try {
    const queryString = new URLSearchParams({
      key: YOUTUBE_API_KEY,
      part: "snippet",
      type: "video",
      maxResults: 50,
      ...params,
    }).toString();

    const response = await fetch(`${BASE_URL}?${queryString}`);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("YouTube API fetch failed:", error);
    throw error; // Re-throw to let calling code handle it
  }
};

// Fetch default gospel songs
export const fetchDefaultSongs = async () => {
  return fetchYouTubeData({
    q: "gospel songs",
    order: "viewCount", // Get popular videos first
  });
};

// Search songs by query
export const searchSongs = async (query) => {
  if (!query || query.trim() === "") {
    return fetchDefaultSongs(); // Fallback to default if empty query
  }
  return fetchYouTubeData({
    q: `${query} gospel`, // Always include "gospel" in searches
  });
};

// Optional: Fetch more details for a specific video
export const getVideoDetails = async (videoId) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&part=snippet,contentDetails&id=${videoId}`
    );
    const data = await response.json();
    return data.items[0] || null;
  } catch (error) {
    console.error("Failed to fetch video details:", error);
    return null;
  }
};
