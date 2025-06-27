import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Pressable,
  Touchable,
} from "react-native";
// import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const GeneratedScreen = ({ route }) => {
  const { topic } = route.params;
  console.log(topic);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.arrorContainer}>
        <Pressable
          style={{
            padding: 10,
            marginBottom: 16,
            marginTop: 30,
            marginRight: 20,
          }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close-sharp" size={40} color="#ff008c" />
          {/* <AntDesign name="arrowleft" size={30} color="#ff008c" /> */}
        </Pressable>
      </View>
      <StatusBar barStyle="light-content" backgroundColor="#071738" />
      <FlatList
        data={topic.prayers}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={<Text style={styles.title}>{topic.topic}</Text>}
        renderItem={({ item }) => (
          <View style={styles.prayerItem}>
            <Text style={styles.prayerText}>{item.text}</Text>
            <View style={styles.versRefContainer}>
              <Text style={styles.verseRef}>Verse Refrence</Text>
              <Text style={styles.verse}>{item.verseRef}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        style={styles.startPrayer}
        onPress={() => navigation.navigate("HowToPrayScreen", { topic: topic })}
      >
        <Text>Guided Prayer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#071738",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0ee1c4",
    marginTop: 30,
    marginBottom: 16,
  },
  prayerItem: {
    marginBottom: 16,
    // backgroundColor: "#1e2572",
    padding: 16,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ff008c",
  },
  prayerText: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 6,
  },
  versRefContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 5,
    gap: 40,
    alignItems: "center",
  },
  verseRef: {
    color: "#ffffff",
    fontSize: 14,
    fontStyle: "italic",
    fontWeight: "bold",
  },
  verse: {
    color: "#46a8e3",
    fontSize: 16,

    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 40,
  },
  arrorContainer: {
    width: "100%",
    alignItems: "flex-end",
  },
  startPrayer: {
    backgroundColor: "#e4f5ed",
    //     backgroundColor: "#ff008c",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
    marginBottom: 20,
  },
});

export default GeneratedScreen;
