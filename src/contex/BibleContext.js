import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const BibleContext = createContext();

export const BibleProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [genres, setGenres] = useState([]);
  const [bibleData, setBibleData] = useState({}); // Changed to object for better lookup
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI States
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [showBookSelector, setShowBookSelector] = useState(true);
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [showVerseSelector, setShowVerseSelector] = useState(false);
  const [showBibleMenu, setShowBibleMenu] = useState(false);

  // Default chapter counts by book ID
  const getDefaultChapterCount = (bookId) => {
    const chapterCounts = {
      1: 50,
      2: 40,
      3: 27,
      4: 36,
      5: 34, // Genesis - Deuteronomy
      6: 24,
      7: 21,
      8: 4,
      9: 31,
      10: 24, // Joshua - 2 Samuel
      11: 22,
      12: 25,
      13: 29,
      14: 36,
      15: 10, // 1 Kings - Esther
      16: 13,
      17: 10,
      18: 42,
      19: 150,
      20: 31, // Job - Proverbs
      21: 12,
      22: 8,
      23: 66,
      24: 52,
      25: 5, // Ecclesiastes - Lamentations
      26: 48,
      27: 12,
      28: 14,
      29: 3,
      30: 9, // Ezekiel - Amos
      31: 1,
      32: 4,
      33: 7,
      34: 3,
      35: 3, // Obadiah - Nahum
      36: 3,
      37: 2,
      38: 14,
      39: 4, // Habakkuk - Malachi
      40: 28,
      41: 16,
      42: 24,
      43: 21,
      44: 28, // Matthew - Acts
      45: 16,
      46: 16,
      47: 13,
      48: 6,
      49: 6, // Romans - Galatians
      50: 6,
      51: 4,
      52: 4,
      53: 5,
      54: 3, // Ephesians - 1 John
      55: 1,
      56: 1,
      57: 1,
      58: 22, // 2 John - Revelation
    };
    return chapterCounts[bookId] || 30; // Default fallback
  };

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [booksRes, translationsRes, genresRes] = await Promise.all([
        axios.get("https://bible-go-api.rkeplin.com/v1/books"),
        axios.get("https://bible-go-api.rkeplin.com/v1/translations"),
        axios.get("https://bible-go-api.rkeplin.com/v1/genres"),
      ]);

      const processedBooks = booksRes.data.map((book) => ({
        ...book,
        chapters: book.chapters || getDefaultChapterCount(book.id),
        testament: book.id < 40 ? "OT" : "NT", // Pre-calculate testament
      }));

      setBooks(processedBooks);
      setTranslations(translationsRes.data);
      setGenres(genresRes.data);
    } catch (error) {
      console.error("Failed to fetch Bible API data:", error);
      setError("Failed to load initial data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChapter = async (bookId, chapterId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://bible-go-api.rkeplin.com/v1/books/${bookId}/chapters/${chapterId}`
      );

      if (!res.data?.verses) {
        throw new Error("No verses data in response");
      }

      setBibleData((prev) => ({
        ...prev,
        [`${bookId}-${chapterId}`]: {
          book: bookId,
          chapter: chapterId,
          verses: res.data.verses.map((v) => v.text),
          testament: bookId < 40 ? "OT" : "NT", // Use pre-calculated testament
        },
      }));
    } catch (err) {
      console.error(`Error fetching book ${bookId} chapter ${chapterId}:`, err);
      setError(`Failed to load chapter ${chapterId}`);
    } finally {
      setLoading(false);
    }
  };

  const selectBook = (id) => {
    setSelectedBook(id);
    setShowBookSelector(false);
    setShowChapterSelector(true);
    setShowVerseSelector(false);
    setShowBibleMenu(false);
    setSelectedChapter(null);
    setSelectedVerse(null);
  };

  const selectChapter = async (chapterId) => {
    if (!selectedBook) return;

    await fetchChapter(selectedBook, chapterId);
    setSelectedChapter(chapterId);
    setShowChapterSelector(false);
    setShowVerseSelector(true);
    setShowBookSelector(false);
    setShowBibleMenu(false);
    setSelectedVerse(null);
  };

  const selectVerse = (verseIndex) => {
    setSelectedVerse(verseIndex);
    setShowVerseSelector(false);
    setShowChapterSelector(false);
    setShowBookSelector(false);
    setShowBibleMenu(true);
  };

  const openMenuOption = (option) => {
    setShowBibleMenu(false);
    switch (option) {
      case "OT":
      case "NT":
        setShowBookSelector(true);
        break;
      case "CHPT":
        setShowChapterSelector(true);
        break;
      case "VERSE":
        setShowVerseSelector(true);
        break;
    }
    setShowVerseSelector(option === "VERSE");
    setShowChapterSelector(option === "CHPT");
    setShowBookSelector(option === "OT" || option === "NT");
  };

  const toggleBibleMenu = () => {
    setShowBibleMenu((prev) => !prev);
  };

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <BibleContext.Provider
      value={{
        books,
        translations,
        genres,
        bibleData,
        loading,
        error,
        selectedBook,
        selectedChapter,
        selectedVerse,
        showBookSelector,
        showChapterSelector,
        showVerseSelector,
        showBibleMenu,
        selectBook,
        selectChapter,
        selectVerse,
        openMenuOption,
        toggleBibleMenu,
        fetchChapter,
      }}
    >
      {children}
    </BibleContext.Provider>
  );
};

// import React, { createContext, useState, useEffect, useCallback } from "react";
// import axios from "axios";

// export const BibleContext = createContext();

// export const BibleProvider = ({ children }) => {
//   const [books, setBooks] = useState([]);
//   const [translations, setTranslations] = useState([]);
//   const [genres, setGenres] = useState([]);
//   const [bibleData, setBibleData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // UI States
//   const [selectedBook, setSelectedBook] = useState(null);
//   const [selectedChapter, setSelectedChapter] = useState(null);
//   const [selectedVerse, setSelectedVerse] = useState(null);
//   const [showBookSelector, setShowBookSelector] = useState(true);
//   const [showChapterSelector, setShowChapterSelector] = useState(false);
//   const [showVerseSelector, setShowVerseSelector] = useState(false);
//   const [showBibleMenu, setShowBibleMenu] = useState(false);

//   // Enhanced fetchInitialData with error handling and logging
//   const fetchInitialData = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const [booksRes, translationsRes, genresRes] = await Promise.all([
//         axios.get("https://bible-go-api.rkeplin.com/v1/books"),
//         axios.get("https://bible-go-api.rkeplin.com/v1/translations"),
//         axios.get("https://bible-go-api.rkeplin.com/v1/genres"),
//       ]);

//       console.log("Books API Response:", booksRes.data);
//       console.log("Translations API Response:", translationsRes.data);
//       console.log("Genres API Response:", genresRes.data);

//       // Transform books data to ensure chapters property exists
//       const processedBooks = booksRes.data.map((book) => ({
//         ...book,
//         chapters: book.chapters || getDefaultChapterCount(book.id),
//       }));

//       setBooks(processedBooks);
//       setTranslations(translationsRes.data);
//       setGenres(genresRes.data);
//     } catch (error) {
//       console.error("Failed to fetch Bible API data:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Helper function for default chapter counts
//   const getDefaultChapterCount = (bookId) => {
//     // OT books generally have more chapters than NT books
//     return bookId < 40 ? 50 : 30; // Adjust numbers based on actual Bible
//   };

//   // Get testament type
//   const getTestament = (id) => {
//     const index = books.findIndex((b) => b.id === id);
//     return index < 39 ? "OT" : "NT";
//   };

//   // Fetch chapter data with improved error handling
//   const fetchChapter = async (bookId, chapterId) => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `https://bible-go-api.rkeplin.com/v1/books/${bookId}/chapters/${chapterId}`
//       );

//       setBibleData((prev) => [
//         ...prev.filter((b) => !(b.book === bookId && b.chapter === chapterId)),
//         {
//           book: bookId,
//           chapter: chapterId,
//           verses: res.data.verses.map((v) => v.text),
//           testament: getTestament(bookId),
//         },
//       ]);
//     } catch (err) {
//       console.error("Error fetching chapter:", err);
//       setError(`Failed to load chapter ${chapterId}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial data fetch
//   useEffect(() => {
//     fetchInitialData();
//   }, [fetchInitialData]);

//   // Rest of your context methods (selectBook, selectChapter, etc.) remain the same
//   // ...
//   // Select book
//   const selectBook = (id) => {
//     setSelectedBook(id);
//     setShowBookSelector(false);
//     setShowChapterSelector(true);
//     setShowVerseSelector(false);
//     setShowBibleMenu(false);
//     setSelectedChapter(null);
//     setSelectedVerse(null);
//   };

//   // Select chapter
//   const selectChapter = async (chapterId) => {
//     if (!selectedBook) {
//       console.warn("No book selected yet.");
//       return;
//     }

//     console.log(`Selected Book: ${selectedBook}, Chapter: ${chapterId}`);

//     await fetchChapter(selectedBook, chapterId);
//     const fetchedChapter = bibleData.find(
//       (data) => data.book === selectedBook && data.chapter === chapterId
//     );

//     if (fetchedChapter) {
//       console.log("Fetched Chapter Verses:", fetchedChapter.verses);
//     } else {
//       console.warn("Chapter not yet in bibleData after fetch.");
//     }

//     setSelectedChapter(chapterId);
//     setShowChapterSelector(false);
//     setShowVerseSelector(true);
//     setShowBookSelector(false);
//     setShowBibleMenu(false);
//     setSelectedVerse(null);
//   };

//   //   // Select verse
//   const selectVerse = (verseIndex) => {
//     setSelectedVerse(verseIndex);
//     // Auto-hide everything and show bible icon
//     setShowVerseSelector(false);
//     setShowChapterSelector(false);
//     setShowBookSelector(false);
//     setShowBibleMenu(true);
//   };

//   //   // Open menu options (OT, NT, CHPT, VERSE)
//   const openMenuOption = (option) => {
//     setShowBibleMenu(false);
//     if (option === "OT") {
//       setShowBookSelector(true);
//       setShowChapterSelector(false);
//       setShowVerseSelector(false);
//     } else if (option === "NT") {
//       setShowBookSelector(true);
//       setShowChapterSelector(false);
//       setShowVerseSelector(false);
//     } else if (option === "CHPT") {
//       setShowChapterSelector(true);
//       setShowBookSelector(false);
//       setShowVerseSelector(false);
//     } else if (option === "VERSE") {
//       setShowVerseSelector(true);
//       setShowBookSelector(false);
//       setShowChapterSelector(false);
//     }
//   };

//   // Toggle the Bible menu (icon)
//   const toggleBibleMenu = () => {
//     setShowBibleMenu((prev) => !prev);
//   };

//   return (
//     <BibleContext.Provider
//       value={{
//         books,
//         translations,
//         genres,
//         bibleData,
//         fetchChapter,
//         loading,
//         error,
//         selectedBook,
//         selectedChapter,
//         selectedVerse,
//         showBookSelector,
//         showChapterSelector,
//         showVerseSelector,
//         showBibleMenu,
//         selectBook,
//         selectChapter,
//         selectVerse,
//         openMenuOption,
//         toggleBibleMenu,
//       }}
//     >
//       {children}
//     </BibleContext.Provider>
//   );
// };

// // context/BibleContext.js
// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const BibleContext = createContext();

// export const BibleProvider = ({ children }) => {
//   const [books, setBooks] = useState([]);
//   const [translations, setTranslations] = useState([]);
//   const [genres, setGenres] = useState([]);
//   const [bibleData, setBibleData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // UI States
//   const [selectedBook, setSelectedBook] = useState(null);
//   const [selectedChapter, setSelectedChapter] = useState(null);
//   const [selectedVerse, setSelectedVerse] = useState(null);

//   const [showBookSelector, setShowBookSelector] = useState(true);
//   const [showChapterSelector, setShowChapterSelector] = useState(false);
//   const [showVerseSelector, setShowVerseSelector] = useState(false);
//   const [showBibleMenu, setShowBibleMenu] = useState(false); // bible icon toggle

//   // Fetch initial data
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setLoading(true);
//         const [booksRes, translationsRes, genresRes] = await Promise.all([
//           axios.get(
//             "https://bible-go-api.rkeplin.com/v1/books?includeChapters=true"
//           ), // Modified endpoint
//           axios.get("https://bible-go-api.rkeplin.com/v1/translations"),
//           axios.get("https://bible-go-api.rkeplin.com/v1/genres"),
//           // const [booksRes, translationsRes, genresRes] = await Promise.all([
//           //   axios.get("https://bible-go-api.rkeplin.com/v1/books"),
//           //   axios.get("https://bible-go-api.rkeplin.com/v1/translations"),
//           //   axios.get("https://bible-go-api.rkeplin.com/v1/genres"),
//         ]);

//         setBooks(booksRes.data);
//         setTranslations(translationsRes.data);
//         setGenres(genresRes.data);
//       } catch (error) {
//         console.error("Failed to fetch Bible API data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   // Get testament type
//   const getTestament = (id) => {
//     const index = books.findIndex((b) => b.id === id);
//     return index < 39 ? "OT" : "NT";
//   };
//   // Fetch chapter data
//   const fetchChapter = async (id, chapterId) => {
//     try {
//       const res = await axios.get(
//         `https://bible-go-api.rkeplin.com/v1/books/${id}/chapters/${chapterId}`
//       );
//       console.log("API Response for Chapter:", res.data);

//       const verses = res.data.verses.map((v) => v.text);

//       setBibleData((prev) => [
//         ...prev.filter((b) => !(b.book === id && b.chapter === chapterId)),
//         {
//           book: id,
//           chapter: chapterId,
//           verses,
//           testament: getTestament(id),
//         },
//       ]);
//     } catch (err) {
//       console.error("Error fetching chapter:", err);
//     }
//   };

//   // Select book
//   const selectBook = (id) => {
//     setSelectedBook(id);
//     setShowBookSelector(false);
//     setShowChapterSelector(true);
//     setShowVerseSelector(false);
//     setShowBibleMenu(false);
//     setSelectedChapter(null);
//     setSelectedVerse(null);
//   };

//   // Select chapter

//   const selectChapter = async (chapterId) => {
//     if (!selectedBook) {
//       console.warn("No book selected yet.");
//       return;
//     }

//     console.log(`Selected Book: ${selectedBook}, Chapter: ${chapterId}`);

//     await fetchChapter(selectedBook, chapterId);
//     const fetchedChapter = bibleData.find(
//       (data) => data.book === selectedBook && data.chapter === chapterId
//     );

//     if (fetchedChapter) {
//       console.log("Fetched Chapter Verses:", fetchedChapter.verses);
//     } else {
//       console.warn("Chapter not yet in bibleData after fetch.");
//     }

//     setSelectedChapter(chapterId);
//     setShowChapterSelector(false);
//     setShowVerseSelector(true);
//     setShowBookSelector(false);
//     setShowBibleMenu(false);
//     setSelectedVerse(null);
//   };

//   // Select verse
//   const selectVerse = (verseIndex) => {
//     setSelectedVerse(verseIndex);
//     // Auto-hide everything and show bible icon
//     setShowVerseSelector(false);
//     setShowChapterSelector(false);
//     setShowBookSelector(false);
//     setShowBibleMenu(true);
//   };

//   // Open menu options (OT, NT, CHPT, VERSE)
//   const openMenuOption = (option) => {
//     setShowBibleMenu(false);
//     if (option === "OT") {
//       setShowBookSelector(true);
//       setShowChapterSelector(false);
//       setShowVerseSelector(false);
//     } else if (option === "NT") {
//       setShowBookSelector(true);
//       setShowChapterSelector(false);
//       setShowVerseSelector(false);
//     } else if (option === "CHPT") {
//       setShowChapterSelector(true);
//       setShowBookSelector(false);
//       setShowVerseSelector(false);
//     } else if (option === "VERSE") {
//       setShowVerseSelector(true);
//       setShowBookSelector(false);
//       setShowChapterSelector(false);
//     }
//   };

//   // Toggle the Bible menu (icon)
//   const toggleBibleMenu = () => {
//     setShowBibleMenu((prev) => !prev);
//   };

//   return (
//     <BibleContext.Provider
//       value={{
//         books,
//         translations,
//         genres,
//         bibleData,
//         fetchChapter,
//         loading,

//         // UI state and controls
//         selectedBook,
//         selectedChapter,
//         selectedVerse,

//         showBookSelector,
//         showChapterSelector,
//         showVerseSelector,
//         showBibleMenu,

//         selectBook,
//         selectChapter,
//         selectVerse,
//         openMenuOption,
//         toggleBibleMenu,
//       }}
//     >
//       {children}
//     </BibleContext.Provider>
//   );
// };
