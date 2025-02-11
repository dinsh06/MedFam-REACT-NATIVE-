import { Text, View, StyleSheet, Button, Dimensions } from "react-native";
import React from "react";
import Slider from "@/components/Slider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { height } = Dimensions.get("window");

export default function HomePage() {
  return (
    <View style={styles.container}>
      {/* Profile Icon + Button */}
      <View style={styles.profileContainer}>
        <Icon name="account-circle" size={50} color="black" />
        <Button title="Profile" onPress={() => alert("Profile Pressed")} />
      </View>

      {/* White Box containing Buttons */}
      <View style={styles.boxContainer}>
        <View style={styles.table}>
          <View style={styles.row}>
            <Button title="Medicines" onPress={() => alert("Medicines pressed")} />
            <Button title="Cart" onPress={() => alert("Cart pressed")} />
          </View>
          <View style={styles.row}>
            <Button title="Offers" onPress={() => alert("Offers pressed")} />
            <Button title="Profile" onPress={() => alert("Profile pressed")} />
          </View>
        </View>
      </View>

      {/* Slider Component */}
      <View style={styles.carouselContainer}>
        <Slider />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F88B88",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  table: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  carouselContainer: {
    height: height * 0.3,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 10,
  },
  boxContainer: {
    backgroundColor: "white",
    padding: 20,               // Adds space inside the box
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    gap: 10,
    margin: 20,   // Added margin to prevent it from sticking to the top right
  },
});
