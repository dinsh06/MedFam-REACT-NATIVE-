import { Text, View, Button, Dimensions, TouchableOpacity, Linking, Image, FlatList } from "react-native";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { BackHandler, Platform } from "react-native";
import { TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<any[]>([]); // State to store fetched templates

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwt");
        setIsLoggedIn(!!token);

        if (!token) {
          setTemplates([]);  // Clear templates if no token is found
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        setIsLoggedIn(false);
      }
    };

    checkToken();
  }, []); 

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwt");
        const response = await fetch("http://192.168.29.174:5000/templates", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setTemplates(data.templates);
        } else {
          console.error("Failed to fetch templates");
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    if (isLoggedIn) {
      fetchTemplates(); // Fetch templates when the user is logged in
    }
  }, [isLoggedIn]);  // Re-run the effect when the login status changes

  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const handleCall = async () => {
    const phoneNumber = "tel:9003276026";
    try {
      const supported = await Linking.canOpenURL(phoneNumber);
      if (supported) {
        Linking.openURL(phoneNumber);
      } else {
        alert("Unable to make a call");
      }
    } catch (err) {
      console.error("An error occurred", err);
      alert("Error occurred while placing the call");
    }
  };


  const temp = [
    { id: "4", source: require("../assets/images/accucheck.jpg") },
    { id: "5", source: require("../assets/images/medicalkit.jpg") },
    { id: "6", source: require("../assets/images/dettol.jpg") },
  ];

  return (
    <View style={styles.container}>
      {/* Top Bar Container */}
      <View style={styles.topBarContainer}>
        <View style={styles.container4}>
          <Image source={require("../assets/images/Logo.png")} style={styles.image} />
          <Text style={styles.container4Text}>MedFam</Text>
        </View>

        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
            <View style={styles.iconWrapper}>
              <Icon name="magnify" size={30} color="white" />
              <Text style={styles.iconLabel2}>Search</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/cart")}>
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
      </View>

      {showSearch && (
        <TextInput
          style={styles.searchInput}
          placeholder="Search your medicine..."
          placeholderTextColor="gray"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
          onSubmitEditing={() => {
            if (searchQuery.trim() !== "") {
              router.push({ pathname: "/product", params: { query: searchQuery } });
            }
          }}
        />
      )}

      {/* Grid UI */}
      <View style={styles.boxContainer}>
        <View style={styles.grid}>
          <View style={styles.row}>
            <View style={[styles.cell, styles.rightBorder, styles.bottomBorder]}>
              <TouchableOpacity onPress={handleCall} style={styles.emergencyButton}>
                <View style={styles.iconRow}>
                  <Icon name="ambulance" size={40} color="red" />
                  <Icon name="phone" size={40} color="red" />
                </View>
                <Text style={styles.iconLabel}>Emergency Call</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.cell, styles.bottomBorder]}>
              <TouchableOpacity onPress={() => router.push("/medfamplus")} style={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Icon name="account-star" size={40} color="lightblue" />
                  <Icon name="shield-plus" size={40} color="gold" style={{ marginLeft: 5 }} />
                </View>
                <Text style={styles.iconLabel}>MedFam +</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.cell, styles.leftBorder, styles.bottomBorder]}>
              <TouchableOpacity onPress={() => router.push("/products")}>
                <Icon name="pill" size={40} color="green" />
                <Text style={styles.iconLabel}>Medicine</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.cell, styles.rightBorder]}>
              <Icon name="account-plus-outline" size={40} color="black" />
              <Text style={styles.iconLabel}>Add User</Text>
            </View>
            <TouchableOpacity style={styles.cell} onPress={() => router.push("/templates")}>
              <Icon name="account-group-outline" size={40} color="black" />
              <Text style={styles.iconLabel}>Templates</Text>
            </TouchableOpacity>
            <View style={[styles.cell, styles.leftBorder]}>
              <Icon name="account-minus-outline" size={40} color="black" />
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

      {/* Dynamic Template List */}
      <FlatList
  data={templates}
  renderItem={({ item }) => (
    <View style={styles.templateItem}>
      <Text style={styles.templateTitle}>{item.tempname}</Text>
      <TouchableOpacity
        onPress={() => router.push({ pathname: "/template", params: { id: item.tempname } })}
      >
        <Text style={styles.templateText}>View</Text>
      </TouchableOpacity>
    </View>
  )}
  keyExtractor={(item) => item.tempname}
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.carouselContainer}
/>

      <View style={styles.container3}>
        <View style={styles.offersContainer2}>
          <Icon name="medical-bag" size={30} color="yellow" />
          <Text style={styles.text}>Medical Kits</Text>
        </View>
      </View>

      {/* Medical Kit Images (Static Data) */}
      <FlatList
        data={temp}
        renderItem={({ item }) => (
          <View style={styles.templateItem}>
            <Image source={item.source} style={styles.templateImage} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={true}
        ItemSeparatorComponent={() => <View style={{ width: 0 }} />}
        contentContainerStyle={{ paddingLeft: 12.5 }}
        snapToAlignment="start"
      />
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F88B88",
    flex: 1,
    alignItems: "center",
    paddingBottom: hp("0%"),
    paddingTop: Platform.OS === "android" ? hp("0%") : hp("3%"),
  },
  topBarContainer: {
    width: wp("87.5%"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  container4: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: wp("15%"),
    height: hp("10%"),
    resizeMode: "contain",
  },
  container4Text: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: "green",
    marginLeft: wp("2%"),
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2.5%"),
  },
  iconWrapper: {
    alignItems: "center",
  },
  iconLabel2: {
    fontSize: wp("3%"),
    color: "white",
    marginTop: hp("0.5%"),
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F88B88",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: wp("5%"),
    color: "white",
  },
  searchInput: {
    height: hp("4%"),
    width: wp("87.5%"),
    borderColor: "gray",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: wp("2.5%"),
    marginTop: hp("1.5%"),
    marginBottom: hp("2.5%"),
    backgroundColor: "white",
  },
  grid: {
    width: wp("80%"),
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    margin: 1,
    alignItems: "center",
    justifyContent: "center",
    height: hp("10%"),
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
    padding: wp("5%"),
    borderRadius: 10,
    width: wp("87.5%"),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  iconLabel: {
    fontSize: wp("3%"),
    color: "black",
    textAlign: "center",
    marginTop: hp("0.5%"),
  },
  emergencyButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  container3: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: hp("1%"),
  },
  offersContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
  },
  offersContainer2: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
    marginBottom: hp("4%"),
  },
  text: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "white",
    marginLeft: wp("2%"),
  },
  templateItem: {
    width: wp("50%"),
    height: hp("20%"),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: wp("2%"),
    elevation: 5,
    shadowOpacity: 0.3,
  },
  templateTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "bold",
    color: "#333",
  },
  templateText: {
    fontSize: wp("3.5%"),
    color: "blue",
    textDecorationLine: "underline",
    marginTop: hp("11.25%"),
    marginLeft: wp("32.5%"),
  },
  templateImage: {
    width: wp("40%"),
    height: hp("15%"),
    borderRadius: 10,
  },
  carouselContainer: {
    alignItems: "center",
    paddingHorizontal: wp("4.5%"),
  },
});
