import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Markdown from "react-native-markdown-display";

const AIScreen = () => {
  const { verse, reference } = useRoute().params;
  console.log("Verse:", verse);
  console.log("Reference:", reference);

  const [loading, setLoading] = useState(true);
  const [chatText, setChatText] = useState("");
  const [fullResponse, setFullResponse] = useState("");

  const OPENROUTER_API_KEY =
    "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"; // Replace with secure key
  const cleanedText = chatText
    .replace(/\r/g, "") // remove carriage returns
    .replace(/\n{2,}/g, "\n\n") // ensure double line breaks for paragraphs
    .replace(/[^\x00-\x7F]+/g, "");

  const fetchExplanation = async () => {
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://your-app-name.com", // Optional
            "X-Title": "BibleAI", // Optional
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-r1-distill-qwen-32b:free",
            messages: [
              {
                role: "user",
                content: `You are a pastoral and insightful Bible teacher.
Give a clear and short explanation (about 4–6 sentences) for the following verse.
Make it devotional, spiritual, and easy to understand for youth and adults.
Use light markdown formatting such as bold for key terms, but avoid long bullet points.

Reference: ${reference}
Verse: ${verse.text}`,
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (data.choices && data.choices[0]) {
        setFullResponse(data.choices[0].message.content);
        console.log("OpenRouter response:", data.choices[0].message.content);
      } else {
        setFullResponse("**Sorry:** No explanation was returned.");
      }
    } catch (error) {
      console.error("OpenRouter error:", error);
      setFullResponse("**Error:** Failed to fetch explanation.");
    } finally {
      setLoading(false);
    }
  };

  // Simulate chat typing effect
  useEffect(() => {
    if (fullResponse) {
      let i = 0;

      // Ensure chatText starts clean
      setChatText("");

      const interval = setInterval(() => {
        setChatText((prev) => prev + fullResponse.charAt(i));
        i++;

        if (i >= fullResponse.length) {
          clearInterval(interval);
        }
      }, 20); // typing speed in ms

      return () => clearInterval(interval);
    }
  }, [fullResponse]);

  useEffect(() => {
    fetchExplanation();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📖 {reference}</Text>
      <Text style={styles.verseText}>"{verse.verse}"</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationHeader}>🧠 Explanation:</Text>
          {chatText.length < fullResponse.length ? (
            <Text style={{ fontSize: 15, color: "#333", lineHeight: 22 }}>
              {chatText}
            </Text>
          ) : (
            <Markdown style={markdownStyles}>{cleanedText}</Markdown>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default AIScreen;

// Regular styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 10,
    marginTop: 30,
  },
  verseText: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 20,
    color: "#ccc",
    lineHeight: 22,
    textAlign: "center",
  },
  loader: {
    marginTop: 30,
  },
  explanationContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
  },
  explanationHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
});

// Markdown styling
const markdownStyles = {
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
  strong: {
    fontWeight: "bold",
    color: "#111",
  },
  paragraph: {
    marginBottom: 8,
  },
  heading1: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  heading2: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  strong: {
    fontWeight: "bold",
    color: "#000",
  },
  paragraph: {
    marginBottom: 12,
  },
};
