import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import Navigation from "../component/Navigation";
import DailyVerse from "../component/DailyVerse";
import DailyBibleReading from "../component/DailyBibleReading";
import PrayerPoint from "../component/PrayerPoint";
import Affirmation from "../component/Affirmation";
import AntDesign from "@expo/vector-icons/AntDesign";

const HomeScreen = () => {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#071738" />
      <Navigation /> {/* Fixed at the top */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <DailyVerse />
        <DailyBibleReading />

        {/* divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.roundedContainer}></View>
          <View style={styles.divider}></View>
          <View style={styles.roundedContainer}></View>
        </View>

        <PrayerPoint />
        <Affirmation />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#071738",
    // backgroundColor: "#f8f8fa",
  },
  scrollContent: {
    paddingHorizontal: 4,
    paddingBottom: 100,
  },
  divider: {
    height: 1,
    backgroundColor: "#ff008c",
    marginVertical: 3,
    width: "90%",
    alignSelf: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    width: "90%",
    alignSelf: "center",
  },
  roundedContainer: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#ff008c",
    height: 15,
    width: 15,
  },
});
