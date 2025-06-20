import { StatusBar } from "expo-status-bar";
// import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import BottomTabs from "./src/navigation/BottomTabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PrayerPointScreen from "./src/screens/PrayerPointScreen";
import GeneratedScreen from "./src/screens/GeneratedScreen";
import { BibleProvider } from "./src/contex/BibleContext";
import AIScreen from "./src/screens/AIScreen";
import HowToPrayScreen from "./src/screens/HowToPrayScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <BibleProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Bottom tabs. */}
          <Stack.Screen name="MainTabs" component={BottomTabs} />

          <Stack.Screen
            name="PrayerPointScreen"
            component={PrayerPointScreen}
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
        </Stack.Navigator>
      </NavigationContainer>
    </BibleProvider>
  );
}
