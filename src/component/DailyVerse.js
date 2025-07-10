import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Foundation from "@expo/vector-icons/Foundation";
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { dailyVerses } from "../Database/DailyVerseDatabase";
import { getTodayDayIndex } from "../utils/dateHelper";

const DailyVerse = () => {
  const todayIndex = getTodayDayIndex();
  const todayVerse = dailyVerses.find((v) => v.day === todayIndex);
  console.log("daily info", todayIndex, todayVerse);

  if (!todayVerse) {
    return (
      <View style={styles.dailyVerseContainer}>
        <Text style={styles.textHeading}>Daily Verse</Text>
        <Text style={styles.verseText}>
          Today's Verse is not available yet.
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#FFDEE9", "#B5FFFC"]}
      style={styles.dailyVerseContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.innerContainer}>
        <View style={styles.verseDesign}></View>

        <View style={styles.verseContent}>
          <View style={styles.verseContainer}>
            <Text style={styles.textHeading}>Daily Verse</Text>
            <Text style={styles.bookText}>{todayVerse.reference}</Text>
          </View>

          {/* 🎉 Animated Verse Text */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 700 }}
          >
            <Text style={styles.verseText}>"{todayVerse.verse}"</Text>
          </MotiView>

          <View style={styles.shareContainer}>
            <Foundation name="like" size={22} color="#14314f" />
            <Entypo name="share" size={22} color="#14314f" />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default DailyVerse;

const styles = StyleSheet.create({
  dailyVerseContainer: {
    borderRadius: 10,
    marginHorizontal: 6,
    marginTop: 10,
    padding: 10,
    elevation: 3,
    minHeight: 200,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 200,
  },
  verseContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  bookText: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "bold",
    fontStyle: "italic",
    lineHeight: 22,
    marginRight: 10,
  },
  verseDesign: {
    width: 4,
    minHeight: 200,
    backgroundColor: "#3edc65",
    borderRadius: 3,
    marginRight: 12,
    marginVertical: "auto",
  },
  verseContent: {
    flex: 1,
  },
  textHeading: {
    fontSize: 16,
    fontWeight: "bold",
    // color: "#14314f",
    color: "#FF5722",
    marginBottom: 6,
  },
  verseText: {
    fontSize: 17,
    color: "#14314f",
    lineHeight: 22,
    fontStyle: "italic",
    // fontWeight: "bold",
  },
  shareContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
    width: "100%",
    paddingHorizontal: 50,
  },
});
