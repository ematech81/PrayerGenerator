// FeatureRow.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ITEMS = [
  {
    id: "devotion",
    label: "Devotion",
    icon: "book-outline",
    iconPack: "Ionicons",
  },
  {
    id: "prayer",
    label: "Prayer Point",
    icon: "hands-pray",
    iconPack: "FontAwesome5",
  },
  {
    id: "ai",
    label: "AI Assistant",
    icon: "robot-outline",
    iconPack: "MaterialCommunityIcons",
  },
  { id: "sermon", label: "Sermon", icon: "mic-outline", iconPack: "Ionicons" },
  {
    id: "affirmation",
    label: "Affirmation",
    icon: "sunny-outline",
    iconPack: "Ionicons",
  },
  {
    id: "community",
    label: "Community",
    icon: "people-outline",
    iconPack: "Ionicons",
  },
  {
    id: "scripture",
    label: "Daily Scripture",
    icon: "calendar-outline",
    iconPack: "Ionicons",
  },
  {
    id: "quiz",
    label: "Bible Quiz",
    icon: "help-circle-outline",
    iconPack: "Ionicons",
  },
];

function renderIcon(
  iconPack,
  iconName,
  size = 30,
  color = "#fff",
  strokeWidth = "12"
) {
  switch (iconPack) {
    case "Ionicons":
      return <Ionicons name={iconName} size={size} color={color} />;
    case "FontAwesome5":
      return <FontAwesome5 name={iconName} size={size} color={color} />;
    case "MaterialCommunityIcons":
      return (
        <MaterialCommunityIcons name={iconName} size={size} color={color} />
      );
    default:
      return null;
  }
}

export default function GridComponent() {
  const navigation = useNavigation();

  const onItemPress = (id) => {
    switch (id) {
      case "devotion":
        navigation.navigate("DevotionScreen");
        break;
      case "prayer":
        navigation.navigate("PrayerScreen");
        break;
      case "ai":
        navigation.navigate("AIAssistanceScreen");
        break;
      case "sermon":
        navigation.navigate("Sermon");
        break;
      case "affirmation":
        navigation.navigate("Affirmation");
        break;
      case "community":
        navigation.navigate("Community");
        break;
      case "scripture":
        navigation.navigate("DailyReadingScreen");
        break;
      case "quiz":
        navigation.navigate("Quiz");
        break;
      default:
        console.warn("Unknown ID:", id);
    }
  };

  return (
    <View styles={styles.container1}>
      <View style={styles.container2}>
        {ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => onItemPress(item.id)}
          >
            {renderIcon(item.iconPack, item.icon)}
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
  },
  container2: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    // backgroundColor: "#1a1",
  },
  card: {
    width: "23%", // 4 items per row with spacing
    aspectRatio: 1, // makes it a square
    margin: "1%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#4B6CB7",
    borderRadius: 12,
    // marginVertical: 10,
  },
  label: {
    marginTop: 4,
    fontSize: 9,
    color: "#ccc",
    textAlign: "center",
    fontWeight: "bold",
  },
});
