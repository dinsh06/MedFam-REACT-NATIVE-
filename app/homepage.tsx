import { Text, View,  Button, Dimensions, TouchableOpacity } from "react-native"; 
import {StyleSheet} from "react-native";
import { useRouter } from "expo-router";
import {Link} from "expo-router";
import * as React from "react";
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
          <TouchableOpacity style={styles.button} onPress={() => alert("Emergency Call Initiated")}>
        <Icon name="phone" size={50} color="red" />
        <Icon name="ambulance" size={50} color="red" />
      </TouchableOpacity>
          </View>
            <View style={[styles.cell, styles.bottomBorder]}>
              <Button title="MedFam +" onPress={() => alert("Medicines pressed")} />
            </View>
            <View style={[styles.cell, styles.leftBorder,styles.bottomBorder]}>
              <Icon name="pill" size={50} onPress={()=>alert(" caps")}/>
            </View>
 
      {/* Emergency Call Icon */}

            
</View>
          {/* Second Row */}
          <View style={styles.row}>
            <View style={[styles.cell, styles.rightBorder]}>
            <Icon name="account-plus-outline" size={50} color="black"/>
            </View>
            <View style={[styles.cell]}>
              
            <Icon name="account-group-outline" size={50} color="black" />

  </View>
  <View style={[styles.cell, styles.leftBorder]}>
              <Icon name="account-minus-outline" size={50} color="black"/>
            </View>
          </View>
        </View>
      </View>
      <View >
        <Text>Offers</Text>
        <Icon name="sale" size={50} color="black" />

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
  leftBorder:{
    borderLeftWidth: 1,
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
  container2: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "green", // Green for emergency
    padding: 10,
    borderRadius: 8,
  },
});
