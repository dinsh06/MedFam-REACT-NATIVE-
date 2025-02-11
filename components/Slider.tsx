import { FlatList, StyleSheet, View, Dimensions } from "react-native";
import React from "react";
import { ImageSlider } from "@/data/SliderData"; // Ensure this is a named export
import SliderItem from "./SliderItem";

const { width } = Dimensions.get("window"); 
const Slider = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={ImageSlider}
        renderItem={({ item, index }) => <SliderItem item={item} index={index} />}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
      />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    height: 180, // Adjust this based on your image size (1/4th of the screen can also be used)
    justifyContent: "center",
  },
  carouselContainer: {
    alignItems: "center", 
    paddingHorizontal: 10,
  },
  sliderItem: {
    width, 
  },
});
