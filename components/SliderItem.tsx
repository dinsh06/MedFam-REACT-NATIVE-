import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { ImageSliderType } from "@/data/SliderData";

type Props = {
  item: ImageSliderType;
  index: number;
};

const SliderItem = ({ item, index }: Props) => {
  return (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={{ width: 500, height: 300 }} />
      <Text>{item.title}</Text>
    </View>
  );
};

export default SliderItem;

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});
