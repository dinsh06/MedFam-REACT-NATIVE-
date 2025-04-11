import React from "react";
import { View, Text, TouchableOpacity, Image, Platform, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const TopHeader = ({ isLoggedIn, searchQuery, setSearchQuery }: any) => {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <View style={styles.logoRow}>
          <Image source={require("../assets/images/Logo.png")} style={styles.logo} />
          <Text style={styles.logoText}>MedFam</Text>
        </View>

        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => router.push("/cart")}>
            <Icon name="cart" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push(isLoggedIn ? "/profile" : "/login")}>
            <Icon name="account-circle" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
  placeholder="Search your medicine..."
  placeholderTextColor="gray"
  value={searchQuery}
  onChangeText={setSearchQuery}
  onSubmitEditing={() => {
    if (searchQuery.trim() !== "") {
      router.push({ pathname: "/product", params: { query: searchQuery } });
    }
  }}
  style={styles.searchBar}
  underlineColor="transparent"
  activeUnderlineColor="transparent"
  mode="flat" // use 'flat' instead of 'outlined' to respect custom radius
  theme={{ roundness: 12 }}
/>

    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: wp("100%"),
    height: hp("22.5%"),
    backgroundColor: "#00B894",
    // backgroundColor: "#F79393",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: Platform.OS === "android" ? hp("2%") : hp("3%"),
    paddingBottom: hp("2%"),
    paddingHorizontal: wp("7.5%"),
    marginBottom: hp("2%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    
  },
  logo: {
    width: wp("12%"),
    height: hp("12%"),
    resizeMode: "contain",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  logoText: {
    fontSize: wp("8%"),
    fontWeight: "bold",
    color: "#F79393",
    marginLeft: wp("1%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("5%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  searchBar: {
    backgroundColor: "#dedebb",
    borderRadius: 12,
    height: hp("5.5%"),
    paddingHorizontal: wp("2%"),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  

});

export default TopHeader;
