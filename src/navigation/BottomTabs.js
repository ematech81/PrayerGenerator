{
  /* <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      let iconName;
      if (route.name === "Home") iconName = "home";
      else if (route.name === "Bible") iconName = "book";
      else if (route.name === "Prayer") iconName = "rose-outline";
      else if (route.name === "Affirmation") iconName = "sparkles-outline";

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: "#ff008c",
    tabBarInactiveTintColor: "gray",
    headerShown: false,

    // 🎨 Style the tab bar
    tabBarStyle: {
      backgroundColor: "#321033", // Change to your desired background color
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: 70,
      position: "absolute",
      overflow: "hidden", // Ensures rounded corners show properly
    },
    tabBarLabelStyle: {
      paddingBottom: 5,
    },
  })}
>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Bible" component={BibleScreen} />
  <Tab.Screen name="Prayer" component={PrayerScreen} />
  <Tab.Screen name="Affirmation" component={AffirmationScreen} />
</Tab.Navigator>; */
}

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import BibleScreen from "../screens/BibleScreen";
import PrayerScreen from "../screens/PrayerScreen";
import AffirmationScreen from "../screens/AffirmationScreen";
import HomeScreen from "../screens/HomeScreen";
import GospelSongSearchScreen from "../screens/GospelSongSearch";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Bible") iconName = "book";
          else if (route.name === "Prayer") iconName = "rose-outline";
          else if (route.name === "Songs") iconName = "sparkles-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#ff008c",
        tabBarInactiveTintColor: "gray",
        headerShown: false,

        // 🎨 Style the tab bar
        tabBarStyle: {
          backgroundColor: "#fff", // Change to your desired background color
          // borderTopLeftRadius: 20,
          // borderTopRightRadius: 20,
          height: 50,
          position: "absolute",
          overflow: "hidden", // Ensures rounded corners show properly
        },
        tabBarLabelStyle: {
          paddingBottom: 5,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bible" component={BibleScreen} />
      <Tab.Screen name="Prayer" component={PrayerScreen} />
      <Tab.Screen name="Songs" component={GospelSongSearchScreen} />
    </Tab.Navigator>
  );
}
