import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import BottomTabs from "./src/navigation/BottomTabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PrayerPointScreen from "./src/screens/PrayerPointScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Bottom tabs. */}
        <Stack.Screen name="MainTabs" component={BottomTabs} />

        <Stack.Screen name="PrayerPointScreen" component={PrayerPointScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    // <SafeAreaView style={styles.safeArea}>
    //   <StatusBar style="auto" />
    //   <BottomTabs />
    // </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "	#fff", // Match app theme
//   },
// });
