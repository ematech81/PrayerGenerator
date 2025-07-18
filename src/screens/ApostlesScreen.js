import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  useColorScheme,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const apostles = [
  {
    id: "peter",
    name: "Peter",
    description: "A fisherman who became a bold leader of the early Church.",
    symbol: "Keys",
    image: require("../assets/apostles/peter.png"),
  },
  {
    id: "john",
    name: "John",
    description:
      "The beloved disciple known for his deep love and gospel writing.",
    symbol: "Eagle",
    image: require("../assets/apostles/john.png"),
  },
  {
    id: "james",
    name: "James",
    description: "One of the first disciples called by Jesus.",
    symbol: "Scallop shell",
    image: require("../assets/apostles/james.png"),
  },
  // Add the rest...
];

export default function ApostlesScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const styles = getStyles(isDarkMode);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.symbol}>Symbol: {item.symbol}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>The Twelve Apostles</Text>
      <FlatList
        data={apostles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const getStyles = (isDarkMode) => {
  const textColor = isDarkMode ? "#ffffff" : "#333";
  const bgColor = isDarkMode ? "#121212" : "#FFF8F0";
  const cardBg = isDarkMode ? "#1e1e1e" : "#ffffff";
  const fontSize = Platform.OS === "ios" ? 16 : 15;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: bgColor,
      paddingTop: 16,
      paddingHorizontal: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
      color: textColor,
      textAlign: "center",
    },
    list: {
      paddingBottom: 32,
    },
    card: {
      backgroundColor: cardBg,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    image: {
      width: SCREEN_WIDTH * 0.5,
      height: SCREEN_WIDTH * 0.5,
      borderRadius: 12,
      marginBottom: 10,
      resizeMode: "contain",
    },
    name: {
      fontSize: fontSize + 2,
      fontWeight: "bold",
      color: textColor,
    },
    description: {
      fontSize: fontSize,
      textAlign: "center",
      color: textColor,
      marginVertical: 6,
    },
    symbol: {
      fontSize: fontSize - 1,
      fontStyle: "italic",
      color: isDarkMode ? "#aaa" : "#555",
    },
  });
};
