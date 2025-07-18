import React, { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { StatusBar } from "expo-status-bar";
// import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import BottomTabs from "./src/navigation/BottomTabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PrayerPointScreen from "./src/screens/PrayerPointScreen";
import AffirmationScreen from "./src/screens/AffirmationScreen";
import GeneratedScreen from "./src/screens/GeneratedScreen";
import { BibleProvider } from "./src/contex/BibleContext";
import AIScreen from "./src/screens/AIScreen";
import HowToPrayScreen from "./src/screens/HowToPrayScreen";
import DailyReadingScreen from "./src/screens/DailyReadingScreen";
import DevotionScreen from "./src/screens/DevotionScreen";
import AudioPlayerScreen from "./src/screens/AudioPlayerScreen";
import { initializeDatabase } from "./src/Database/SqlHelper";
import { syncTranslationsToSQLite } from "./src/SQLDatabaseFill";
import { Platform } from "react-native";
import { fetchVersesFromApiBible } from "./src/utils/apiService";
import VerseScreen from "./src/screens/VerseScreen";
import ChaptersScreen from "./src/screens/ChaptersScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ChildrenLandingScreen from "./src/screens/ChildrenLandingScreen";
import AIAssistanceScreen from "./src/screens/AIAssistanceScreen";


const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    const fetchTestVerses = async () => {
      await fetchVersesFromApiBible(); // test fetch
    };

    fetchTestVerses();
  }, []);

  // const [fontsLoaded] = Font.useFonts({
  //   "Nunito-Regular": require("./src/assets/fonts/Nunito-Regular.ttf"),
  //   "Nunito-Bold": require("./src/assets/fonts/Nunito-Bold.ttf"),
  //   "Roboto-Regular": require("./src/assets/fonts/Roboto-Regular.ttf"),
  //   "Roboto-Bold": require("./src/assets/fonts/Roboto-Bold.ttf"),
  // });

  // useEffect(() => {
  //   async function prepare() {
  //     if (fontsLoaded) {
  //       await SplashScreen.hideAsync();
  //     }
  //   }
  //   prepare();
  // }, [fontsLoaded]);

  // if (!fontsLoaded) return null;

  return (
    <BibleProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Bottom tabs. */}
            <Stack.Screen name="MainTabs" component={BottomTabs} />

            <Stack.Screen
              name="PrayerPointScreen"
              component={PrayerPointScreen}
            />
            <Stack.Screen
              name="AffirmationScreen"
              component={AffirmationScreen}
            />
            <Stack.Screen name="GeneratedScreen" component={GeneratedScreen} />
            <Stack.Screen
              name="AIScreen"
              component={AIScreen}
              options={{ title: "Bible Teacher" }}
            />
            <Stack.Screen
              name="HowToPrayScreen"
              component={HowToPrayScreen}
              // options={{ title: "Bible Teacher" }}
            />
            <Stack.Screen
              name="DailyReadingScreen"
              component={DailyReadingScreen}
              // options={{ title: "Bible Teacher" }}
            />
            <Stack.Screen
              name="DevotionScreen"
              component={DevotionScreen}
              // options={{ title: "Bible Teacher" }}
            />
            <Stack.Screen
              name="AudioPlayerScreen"
              component={AudioPlayerScreen}
              options={{ title: "Audio Player" }}
            />
            <Stack.Screen name="ChaptersScreen" component={ChaptersScreen} />
            <Stack.Screen
              name="ChildrenLandingScreen"
              component={ChildrenLandingScreen}
            />
            <Stack.Screen name="VerseScreen" component={VerseScreen} />
            <Stack.Screen
              name="AIAssistanceScreen"
              component={AIAssistanceScreen}
            />
            <Stack.Screen
              name="KidBibleStoriesScreen"
              component={KidBibleStoriesScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </BibleProvider>
  );
}
