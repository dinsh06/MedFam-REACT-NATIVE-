import { Text, View, Dimensions, TouchableOpacity, Linking, Image, FlatList, TextInput, BackHandler, Platform } from "react-native";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as SecureStore from "expo-secure-store";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import TopHeader from "../components/TopHeader";
import HomeGrid from "../components/HomeGrid";

const { height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwt");
        setIsLoggedIn(!!token);
        if (!token) setTemplates([]);
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
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };
    if (isLoggedIn) fetchTemplates();
  }, [isLoggedIn]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchProducts(searchQuery.trim());
      } else {
        setProducts([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const fetchProducts = async (query: string) => {
    try {
      const res = await fetch(`http://192.168.29.174:5000/search?q=${query}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

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

  const medicalImages = [
    { id: "4", source: require("../assets/images/accucheck.jpg") },
    { id: "5", source: require("../assets/images/medicalkit.jpg") },
    { id: "6", source: require("../assets/images/dettol.jpg") },
  ];

  if (isLoggedIn === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopHeader isLoggedIn={isLoggedIn} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <TextInput
        placeholder="Search for products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />

      {products.length > 0 && (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push({ pathname: "/product", params: { id: item._id } })}
              style={styles.templateItem}
            >
              <Text style={styles.templateTitle}>{item.name}</Text>
              <Text>{item.brand}</Text>
              <Text>₹{item.price}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <HomeGrid handleCall={handleCall} />
      <View style={styles.container3}>
        <View style={styles.offersContainer}>
          <Icon name="account-group-outline" size={30} color="green" />
          <Text style={styles.text}>Templates</Text>
        </View>
      </View>

      <FlatList
        data={templates}
        renderItem={({ item }) => (
          <View style={styles.templateItem}>
            <View style={styles.templateHeader}>
              <Icon name="file-account" size={24} color="grey" style={{ marginRight: 8 }} />
              <Text style={styles.templateTitle}>{item.tempname}</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push({ pathname: "/template", params: { id: item.tempname } })}
              style={styles.viewContainer}
            >
              <Text style={styles.viewText}>View</Text>
              <Icon name="eye" size={20} color="green" style={{ marginLeft: 5 }} />
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

      <FlatList
        data={medicalImages}
        renderItem={({ item }) => (
          <View style={styles.templateItem}>
            <Image source={item.source} style={styles.templateImage} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ paddingLeft: 12.5 }}
        snapToAlignment="start"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dedebb",
    flex: 1,
    alignItems: "center",
    paddingBottom: hp("0%"),
    paddingTop: Platform.OS === "android" ? hp("0%") : hp("3%"),
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
    height: hp("5%"),
    width: wp("87.5%"),
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: wp("3%"),
    backgroundColor: "#fff",
    marginBottom: hp("2%"),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
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
    height: hp("25%"),
    backgroundColor: "#b9d6f2",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: wp("2%"),
    elevation: 5,
    shadowOpacity: 0.3,
  },
  templateTitle: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#333",
  },
  templateImage: {
    width: wp("40%"),
    height: hp("15%"),
    borderRadius: 10,
  },
  templateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  viewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  viewText: {
    fontSize: wp("4%"),
    color: "green",
    fontWeight: "700",
  },
  carouselContainer: {
    alignItems: "center",
    paddingHorizontal: wp("4.5%"),
  },
});
