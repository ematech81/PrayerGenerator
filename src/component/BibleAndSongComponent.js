import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

const BibleAndSongComponent = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Bible card 60 % */}
      <TouchableOpacity
        style={[styles.cardBase, styles.bibleCard]}
        onPress={() => console.log("Bible pressed")}
      >
        <ImageBackground
          source={require("../assets/Bible-card.png")}
          style={styles.cardImg}
        />
      </TouchableOpacity>

      {/* Song card 30 % */}
      <TouchableOpacity
        style={[styles.cardBase, styles.songCard]}
        onPress={() => console.log("Song pressed")}
      >
        <ImageBackground
          source={require("../assets/song-card.png")}
          style={styles.cardImg}
        >
          <View style={styles.centeredContent}>
            <FontAwesome5
              name="music"
              size={24}
              color="black"
              stokeWidth="10"
            />
            <Text style={{ marginTop: 8, fontWeight: "bold" }}>Songs</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

export default BibleAndSongComponent;

const styles = StyleSheet.create({
  /* row container */
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },

  /* shared button style */
  cardBase: {
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 8, // gap between cards
  },

  /* individual sizes */
  bibleCard: { width: "60%" },
  songCard: {
    width: "30%",
  },

  /* let the BackgroundCard fill its wrapper */
  cardImg: { flex: 1 },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
