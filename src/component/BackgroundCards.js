import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

const BackgroundCard = ({ source, children, style, imageStyle }) => {
  return (
    <ImageBackground
      source={source}
      resizeMode="cover"
      style={[styles.card, style]}
      imageStyle={[styles.image, imageStyle]}
    >
      <View style={styles.overlay} />
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    //     overflow: "hidden",
    position: "relative",
    padding: 16,
    justifyContent: "center",
  },
  image: {
    borderRadius: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)", // optional dark overlay for contrast
  },
});

export default BackgroundCard;
