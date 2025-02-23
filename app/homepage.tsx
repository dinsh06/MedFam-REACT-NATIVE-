import { Text, View, Button, Dimensions, TouchableOpacity ,Linking,Image} from "react-native";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router"; 
import * as React from "react";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { BackHandler } from "react-native";
import { TextInput } from "react-native-paper";

const { height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwt");
        setIsLoggedIn(!!token); // Set true if token exists, false otherwise
      } catch (error) {
        console.error("Error fetching token:", error);
        setIsLoggedIn(false);
      }
    };


    checkToken();
  }, []); // Runs only when the component mounts


useEffect(() => {
  const backAction = () => {
    return true; // Prevent going back
  };

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => backHandler.remove();
}, []);


  // Show a loading screen while checking token
  if (isLoggedIn === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

const handleCall=async()=>{
  const phoneNumber="tel:8681040528";
  try{
    const supported= await Linking.canOpenURL(phoneNumber);
    if(supported){
      Linking.openURL(phoneNumber);
    }
    else{
      alert("Unable to make a call");
    }
  } catch(err){
    console.error("An error occured",err);
    alert("Error occured while placing the call");
  }
};
  return (
    <View style={styles.container}>
      <View style={styles.container4}>
        <Image source={require("../assets/images/Logo.png")} style={styles.image} />
        <Text style={styles.container4}>MedFam</Text>
      </View>
      {/* Profile, Search & Cart Icons */}
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
          <View style={styles.iconWrapper}>
            <Icon name="magnify" size={30} color="white" />
            <Text style={styles.iconLabel2}>Search</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => alert("Cart clicked")}>
          <View style={styles.iconWrapper}>
            <Icon name="cart" size={30} color="white" />
            <Text style={styles.iconLabel2}>Cart</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push(isLoggedIn ? "/profile" : "/login")}>
          <View style={styles.iconWrapper}>
            <Icon name="account-circle" size={30} color="white" />
            <Text style={styles.iconLabel2}>{isLoggedIn ? "Profile" : "Login"}</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Search Bar (Only visible when showSearch is true) */}
{showSearch && (
  <TextInput
    style={styles.searchInput}
    placeholder="Search your medicine..."
    placeholderTextColor="gray"
    onChangeText={(text) => console.log(text)}
  />
)}



      {/* Grid Box */}
      <View style={styles.boxContainer}>
        <View style={styles.grid}>
          {/* First Row */}
          <View style={styles.row}>
            <View style={[styles.cell, styles.rightBorder, styles.bottomBorder]}>
              <TouchableOpacity onPress={handleCall} style={styles.emergencyButton}>
                <View style={styles.iconRow}>
                  <Icon name="ambulance" size={30} color="red" />
                  <Icon name="phone" size={30} color="red" />
                </View>
                <Text style={styles.iconLabel}>Emergency Call</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.cell, styles.bottomBorder]}>
              <Button title="Med+" color="gold" onPress={() => alert("Medicines pressed")} />
            </View>

            <View style={[styles.cell, styles.leftBorder, styles.bottomBorder]}>
              <TouchableOpacity onPress={() => alert("caps")}>
                <Icon name="pill" size={30} color="green" />
                <Text style={styles.iconLabel}>Medicine</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Second Row */}
          <View style={styles.row}>
            <View style={[styles.cell, styles.rightBorder]}>
              <Icon name="account-plus-outline" size={30} color="black" />
              <Text style={styles.iconLabel}>Add User</Text>
            </View>
          <TouchableOpacity style={styles.cell} onPress={()=>router.push("/templates")}> 
              <Icon name="account-group-outline" size={30} color="black" />
              <Text style={styles.iconLabel}>Templates</Text>
          </TouchableOpacity>

            <View style={[styles.cell, styles.leftBorder]}>
              <Icon name="account-minus-outline" size={30} color="black" />
              <Text style={styles.iconLabel}>Remove User</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.container3}>
  <View style={styles.offersContainer}>
    <Icon name="account-group-outline" size={30} color="green" />
    <Text style={styles.text}>Templates</Text>
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
    paddingBottom:20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F88B88",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 20,
    color: "white",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    gap: 10,
    margin: 20,
  },
  iconWrapper: {
    alignItems: "center",
    right:22,
    top:-10,
  },
  iconLabel2: {
    fontSize: 12,
    color: "white",
    marginTop: 4,
  },
  grid: {
    width: "80%",
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
  container3: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Ensures left alignment
  },
  offersContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // Adds spacing between icon & text
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 8, // Ensures space between icon & text
  },
  iconLabel: {
    fontSize: 10,
    color: "black",
    textAlign: "center",
    marginTop: 5,
  },
  emergencyButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 5,
  },
  carouselContainer: {
    height: height * 0.3,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 10,
  },
  image:{
    width:100,
    height:100,
    resizeMode:"contain",
    alignItems:"flex-start", 
     },
     container4:{
      position:"absolute",
      top:80,
      left:20,
      zIndex:10,
      flexDirection:"row",
      alignItems:"center",
      padding:10,
      color:"green",
      fontWeight:"bold",
      marginLeft:0,
     },
     searchInput:{
      height:30,
      width:"70%",
      borderColor: "gray",
      borderRadius:10,
      borderWidth:1,
      paddingHorizontal:10,
      marginHorizontal:10,
      marginBottom:10,
      backgroundColor:"white",
      alignSelf:"center",
     },
});
