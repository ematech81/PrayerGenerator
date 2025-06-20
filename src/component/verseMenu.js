// 📜 Full Verse Menu Implementation

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Clipboard,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

const colors = ["#f44336", "#2196f3", "#4caf50", "#ffeb3b"];

const VerseMenu = ({
  verse,
  selectedBook,
  selectedChapter,
  onClose,
  onHighlight,
  onFavorite,
}) => {
  const [showColors, setShowColors] = useState(false);

  const copyVerse = () => {
    const text = `${selectedBook.name} ${selectedChapter}:${verse.verseId} - ${verse.verse}`;
    Clipboard.setStringAsync(text);
    Alert.alert("Copied", "Verse copied to clipboard");
    onClose();
  };

  const shareVerse = async () => {
    const text = `${selectedBook.name} ${selectedChapter}:${verse.verseId} - ${verse.verse}`;
    try {
      await Share.share({ message: text });
    } catch (error) {
      Alert.alert("Error", "Failed to share verse");
    }
    onClose();
  };

  const handleHighlight = (color) => {
    onHighlight(color);
    setShowColors(false);
    onClose();
  };

  const handleFavorite = () => {
    onFavorite();
    onClose();
  };

  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity style={styles.menuItem} onPress={copyVerse}>
        <Feather name="copy" size={20} color="#333" />
        <Text style={styles.menuText}>Copy</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => setShowColors(!showColors)}
      >
        <Feather name="highlight" size={20} color="#333" />
        <Text style={styles.menuText}>Highlight</Text>
      </TouchableOpacity>

      {showColors && (
        <View style={styles.colorRow}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[styles.colorDot, { backgroundColor: color }]}
              onPress={() => handleHighlight(color)}
            />
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.menuItem} onPress={handleFavorite}>
        <MaterialIcons name="favorite-border" size={20} color="#333" />
        <Text style={styles.menuText}>Favorite</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={shareVerse}>
        <Feather name="share-2" size={20} color="#333" />
        <Text style={styles.menuText}>Share</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close-circle" size={24} color="#999" />
      </TouchableOpacity>
    </View>
  );
};

export default VerseMenu;

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
});
