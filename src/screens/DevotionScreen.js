import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MotiView } from "moti";
import CommentSection from "../component/ComentSection";
import devotionImg from "../assets/devotionImg.jpg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { dailyDevotionDatabase } from "../Database/dailyDevotionDatabase";
import { getTodayDayIndex } from "../utils/dateHelper";
import { getFormattedToday } from "../utils/TodayDate";

// 👇 Helper to format **bold** text
const formatStyledText = (text) => {
  const elements = [];

  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;

  const matches = text.matchAll(regex);

  for (const match of matches) {
    const matchText = match[0];
    const index = match.index;

    // Push text before the match
    if (index > lastIndex) {
      elements.push(text.substring(lastIndex, index));
    }

    // Style match
    if (matchText.startsWith("**")) {
      elements.push(
        <Text key={index} style={{ fontWeight: "bold" }}>
          {matchText.slice(2, -2)}
        </Text>
      );
    } else if (matchText.startsWith("*")) {
      elements.push(
        <Text key={index} style={{ fontStyle: "italic" }}>
          {matchText.slice(1, -1)}
        </Text>
      );
    }

    lastIndex = index + matchText.length;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements;
};

const DevotionScreen = () => {
  const { width } = Dimensions.get("window");
  const route = useRoute();
  const navigation = useNavigation();

  const todayIndex = getTodayDayIndex(); // fallback
  const passedDay = route.params?.day || todayIndex;

  const devotion = dailyDevotionDatabase.find((d) => d.day === passedDay);

  if (!devotion) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text> No Devotion Yet, Kindly Check Back Later.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <FlatList
        data={devotion.sections}
        keyExtractor={(item, index) => `section-${index}`}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>{item.heading}</Text>
            <Text style={styles.sectionContent}>
              {formatStyledText(item.content)}
            </Text>
          </View>
        )}
        ListHeaderComponent={
          <>
            <Image
              source={devotionImg}
              style={[styles.headerImage, { width }]}
              resizeMode="cover"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Go Back Home</Text>
            </TouchableOpacity>

            <Text style={styles.title}>{devotion.title}</Text>
            <Text style={styles.date}>Today, {getFormattedToday()}</Text>

            {/* Introduction */}

            <MotiView
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 900 }}
              style={styles.section}
            >
              <Text style={styles.sectionIntro}>
                {" "}
                {formatStyledText(devotion.introduction)}
              </Text>
            </MotiView>

            {/* Readings and Messages */}
            {devotion.readings.map((reading, index) => (
              <View key={index} style={styles.section}>
                <Text style={styles.sectionHeading}>
                  {reading.book} {reading.chapter}
                </Text>
                <Text style={styles.keyVerse}>
                  <Text style={{ fontStyle: "italic", color: "#d0342c" }}>
                    {" "}
                    {reading.keyVerse.text}{" "}
                  </Text>{" "}
                  <Text style={styles.verseRef}>
                    ({reading.keyVerse.reference}){" "}
                  </Text>{" "}
                </Text>
                <Text style={styles.sectionContent}>
                  {" "}
                  {formatStyledText(reading.message)}
                </Text>
              </View>
            ))}
          </>
        }
        ListFooterComponent={
          <>
            {/* Reflection Questions */}
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Reflection Questions</Text>
              {devotion.reflectionQuestions.map((q, i) => (
                <Text key={i} style={styles.bulletPoint}>
                  • {q}
                </Text>
              ))}
            </View>

            {/* Prayer */}
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Prayer</Text>
              <Text style={styles.prayer}>{devotion.prayer}</Text>
            </View>

            {/* Comments */}
            <CommentSection />
          </>
        }
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
    backgroundColor: "#ffffff",
  },
  headerImage: {
    height: 200,
    //     borderRadius: 16,
    marginBottom: 20,
    alignSelf: "center",
    marginTop: 10,
  },
  button: {
    alignSelf: "flex-end",
    marginBottom: 5,
    // backgroundColor: "#2563eb", // Blue color
  },
  buttonText: {
    // color: "#ffffff",
    fontSize: 11,
    // fontWeight: "600",
    textAlign: "center",
    fontStyle: "italic",
    textDecoration: "underline",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },

  date: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 12,
    alignSelf: "flex-start",
    fontWeight: "bold",
  },
  // date: {
  //   fontSize: 14,
  //   color: "#6b7280",
  //   marginBottom: 16,
  // },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e", // Light gray border
  },
  sectionIntro: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    textAlign: "justify",
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
    fontStyle: "italic",
  },
  sectionContent: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 28,
    textAlign: "justify",
  },
  bulletPoint: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 6,
  },
  prayer: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#1e293b",
    lineHeight: 24,
  },
  keyVerse: {
    fontSize: 16,
    color: "#b91c1c", // Deep warm red
    lineHeight: 24,
    marginBottom: 10,
    fontStyle: "italic",
    borderBottomColor: "#e5e7eb", // Light gray border
    borderBottomWidth: 1,
  },

  verseRef: {
    fontSize: 14,
    color: "#9b1c1c",
    fontStyle: "normal",
  },
});

export default DevotionScreen;
