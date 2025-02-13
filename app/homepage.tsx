import { Text, View, StyleSheet, Button, Dimensions, TouchableOpacity } from "react-native"; 
import { useRouter } from "expo-router";
import {Link} from "expo-router";
import React from "react";
import Slider from "@/components/Slider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { height } = Dimensions.get("window");

export default function HomePage() {
  const router = useRouter(); 

  return (
    <View style={styles.container}>
      {/* Profile Icon */}
      <View style={styles.profileContainer}>
        <Icon name="cart" size={50} color="white" />
      <TouchableOpacity onPress={() => alert("Search bar clicked")}>
          <Icon name="magnify" size={50} color="white" />
        </TouchableOpacity>
      <Link href="/profile">
  <Icon name="account-circle" size={50} color="white" />
</Link>
        
      </View>

      {/* Grid Box */}
      <View style={styles.boxContainer}>
        <View style={styles.grid}>
          {/* First Row */}
          <View style={styles.row}>
            <View style={[styles.cell, styles.rightBorder, styles.bottomBorder]}>
              <Button title="Medicines" onPress={() => alert("Medicines pressed")} />
            </View>
            <View style={[styles.cell, styles.bottomBorder]}>
              <Button title="Cart" onPress={() => alert("Cart pressed")} />
            </View>
          </View>

          {/* Second Row */}
          <View style={styles.row}>
            <View style={[styles.cell, styles.rightBorder]}>
              <Button title="Offers" onPress={() => alert("Offers pressed")} />
            </View>
            <View style={styles.cell}>
              <Button title="Profile" onPress={() => router.push("/profile")} />
            </View>
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
  grid: {
    width: "80%",
    borderWidth: 0, // Remove outer border
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    padding: 10,
    margin: 2,
    alignItems: "center",
    justifyContent: "center",
    height: 70, // Adjust height for buttons
  },
  rightBorder: {
    borderRightWidth: 1,
    borderColor: "black",
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderColor: "black",
  },
  boxContainer: {
    backgroundColor: "white",
    padding: 20,
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
    margin: 20,
  },
  carouselContainer: {
    height: height * 0.3,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 10,
  },
});
