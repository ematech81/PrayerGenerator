import {
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Navigation from "../component/Navigation";
import DailyVerse from "../component/DailyVerse";
import DailyBibleReading from "../component/DailyBibleReading";
import PrayerPoint from "../component/PrayerPoint";
import Affirmation from "../component/Affirmation";
import BibleAndSongComponent from "../component/BibleAndSongComponent";
import GridComponent from "../component/GridComponent";
import ChildrenBibleAndAearch from "../component/ChildrenBibleAndSearch";

const HomeScreen = () => {
  return (
    <ImageBackground
      source={require("../assets/verseHeader.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.screen}>
        <Navigation />
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <DailyVerse />
          </View>

          <View style={styles.section}>
            <BibleAndSongComponent />
          </View>

          <View style={styles.section}>
            <GridComponent />
          </View>
          <View style={styles.section}>
            <ChildrenBibleAndAearch />
          </View>

          {/* Uncomment these as needed */}
          {/* <View style={styles.section}>
            <PrayerPoint />
          </View>

          <View style={styles.section}>
            <DailyBibleReading />
          </View>

          <View style={styles.section}>
            <Affirmation />
          </View> */}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  bg: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 44,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    width: "100%",
    marginBottom: 10,
  },
});
