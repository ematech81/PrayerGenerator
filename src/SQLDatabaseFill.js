import { getDB } from "./Database/SqlHelper";
import { fetchAllTranslations } from "./utils/apiService";

export const insertTranslations = async (translations) => {
  const db = getDB();

  db.transaction(
    (tx) => {
      for (let i = 0; i < translations.length; i++) {
        const t = translations[i];
        tx.executeSql(
          `INSERT OR REPLACE INTO translations 
           (id, abbreviation, version, language, tableName) 
           VALUES (?, ?, ?, ?, ?);`,
          [t.id, t.abbreviation, t.version, t.language, t.table]
        );
      }
    },
    (error) => {
      console.error("Insert Translations Error:", error);
    },
    () => {
      console.log("✅ Translations inserted successfully");
    }
  );
};

export const syncTranslationsToSQLite = async () => {
  try {
    const translations = await fetchAllTranslations();

    if (!Array.isArray(translations.data)) {
      console.error("Invalid translation format:", translations);
      return;
    }

    await insertTranslations(translations.data);
  } catch (error) {
    console.error("Translation Sync Error:", error);
  }
};
