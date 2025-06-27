// import * as SQLite from "expo-sqlite";
// import { Platform } from "react-native";

// let db = null;

// if (Platform.OS !== "web") {
//   db = SQLite.openDatabase("BibleApp.db");
// }

// export const initializeDatabase = () => {
//   if (!db) return;

//   db.transaction(
//     (tx) => {
//       // Translations Table
//       tx.executeSql(`
//         CREATE TABLE IF NOT EXISTS translations (
//           id INTEGER PRIMARY KEY NOT NULL,
//           abbreviation TEXT,
//           version TEXT,
//           language TEXT,
//           tableName TEXT
//         );
//       `);

//       // Books Table
//       tx.executeSql(`
//         CREATE TABLE IF NOT EXISTS books (
//           id INTEGER PRIMARY KEY NOT NULL,
//           translationId INTEGER,
//           name TEXT,
//           shortName TEXT,
//           bookId TEXT
//           -- FOREIGN KEY (translationId) REFERENCES translations(id)
//         );
//       `);

//       // Chapters Table
//       tx.executeSql(`
//         CREATE TABLE IF NOT EXISTS chapters (
//           id INTEGER PRIMARY KEY NOT NULL,
//           bookId TEXT,
//           chapterNumber INTEGER,
//           UNIQUE (bookId, chapterNumber)
//         );
//       `);

//       // Verses Table
//       tx.executeSql(`
//         CREATE TABLE IF NOT EXISTS verses (
//           id INTEGER PRIMARY KEY NOT NULL,
//           bookId TEXT,
//           chapterNumber INTEGER,
//           verseNumber INTEGER,
//           text TEXT,
//           translationId INTEGER,
//           language TEXT,
//           UNIQUE (bookId, chapterNumber, verseNumber, translationId, language)
//           -- FOREIGN KEY (translationId) REFERENCES translations(id)
//         );
//       `);
//     },
//     (error) => {
//       console.log("❌ DB init error:", error);
//     },
//     () => {
//       console.log("📖 SQLite initialized successfully");
//     }
//   );
// };

// export const getDB = () => db;
