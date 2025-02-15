import { Text, View, Button, Dimensions, TouchableOpacity } from "react-native"; 
import { StyleSheet } from "react-native"; 
import { useRouter } from "expo-router"; 
import { Link } from "expo-router"; 
import * as React from "react"; 
import Slider from "@/components/Slider"; 
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; 

const { height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter(); 

  return (
    <View style={styles.container}>
      {/* Profile Icon */}
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => alert("Search bar clicked")}>
          <Icon name="magnify" size={50} color="white" />
          <Text style={styles.iconLabel2}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert("Cart clicked")}>
          <Icon name="cart" size={50} color="white" />
          <Text style={styles.iconLabel2}>Cart</Text>
        </TouchableOpacity>
        <Link href="/profile">
          <Icon name="account-circle" size={50} color="white" />
          <Text style={styles.iconLabel2}>Profile</Text>
        </Link>
      </View>

      {/* Grid Box */}
      <View style={styles.boxContainer}>
        <View style={styles.grid}>
          {/* First Row */}
          <View style={styles.row}>
          <View style={[styles.cell, styles.rightBorder, styles.bottomBorder]}>
  <TouchableOpacity onPress={() => alert("Emergency Call Initiated")} style={styles.emergencyButton}>
    <View style={styles.iconRow}>
      <Icon name="ambulance" size={50} color="red" />
      <Icon name="phone" size={50} color="red" />
    </View>
    <Text style={styles.iconLabel}>Emergency Call</Text>
  </TouchableOpacity>
</View>
<View style={[styles.cell, styles.bottomBorder]}>
  <Button title="MedFam +" color="gold" onPress={() => alert("Medicines pressed")} />
</View>
<View style={[styles.cell, styles.leftBorder, styles.bottomBorder]}>
  <Icon name="pill" size={50} color="green" onPress={() => alert("caps")} />
  <Text style={styles.iconLabel}>Medicine</Text>
</View>
          </View>

          {/* Second Row */}
          <View style={styles.row}>
            <View style={[styles.cell, styles.rightBorder]}>
              <Icon name="account-plus-outline" size={50} color="black" />
              <Text style={styles.iconLabel}>Add User</Text>
            </View>
            <View style={styles.cell}>
              <Icon name="account-group-outline" size={50} color="black" />
              <Text style={styles.iconLabel}>Templates</Text>
            </View>
            <View style={[styles.cell, styles.leftBorder]}>
              <Icon name="account-minus-outline" size={50} color="black" />
              <Text style={styles.iconLabel}>Remove User</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Offers Section */}
      <View style={styles.container3}>
        <Text style={styles.text}>Offers</Text>
        <Icon name="sale" size={50} color="green" />
        <Text style={styles.iconLabel}>Discounts</Text>
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
    borderWidth: 0,
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
    height: 70,
  },
  rightBorder: {
    borderRightWidth: 1,
    borderColor: "black",
  },
  leftBorder: {
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
  container3: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "left",
  },
  iconLabel: {
    fontSize: 12,
    color: "black",
    textAlign: "center",
    marginTop: 5,
  },
  iconLabel2:{
    fontSize: 12,
    color: "white",
    marginTop: 5,
  },
  emergencyButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 5,  // Optional: Adds some space between icons and label
  },
  
});
