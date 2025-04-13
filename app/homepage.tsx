import { Text, View, Dimensions, TouchableOpacity, Linking, Image, FlatList, TextInput, BackHandler, Platform } from "react-native";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as SecureStore from "expo-secure-store";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import TopHeader from "../components/TopHeader";
import HomeGrid from "../components/HomeGrid";
import TemplateCard from "../components/TemplateCard";

const { height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const medicalImages = [
    { id: "4", source: require("../assets/images/accucheck.jpg") },
    { id: "5", source: require("../assets/images/medicalkit.jpg") },
    { id: "6", source: require("../assets/images/dettol.jpg") },
  ];

  const tripledMedicalImages = [...medicalImages, ...medicalImages, ...medicalImages];
  const kitListRef = useRef<FlatList>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwt");
        setIsLoggedIn(!!token);
        if (!token) setTemplates([]);
        if (!token) setTemplates([]);
      } catch (error) {
        console.error("Error fetching token:", error);
        setIsLoggedIn(false);
      }
    };
    checkToken();
  }, []);
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwt");
        const response = await fetch("http://192.168.0.103:5000/templates", {
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

  const fetchProducts = async (query: string) => {
    try {
      const res = await fetch(`http://192.168.0.103:5000/search?q=${query}`);
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

  useEffect(() => {
    const itemWidth = wp("90%") + wp("4%");
    let scrollIndex = medicalImages.length;
  
    const interval = setInterval(() => {
      scrollIndex += 1;
  
      // Reset if we hit the end
      if (scrollIndex >= tripledMedicalImages.length - 1) {
        scrollIndex = medicalImages.length;
        kitListRef.current?.scrollToOffset({ offset: scrollIndex * itemWidth, animated: false });
      } else {
        kitListRef.current?.scrollToOffset({ offset: scrollIndex * itemWidth, animated: true });
      }
    }, 3000); // every 3 seconds
  
    return () => clearInterval(interval);
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

  if (isLoggedIn === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopHeader isLoggedIn={isLoggedIn} />

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

      </View>

      <FlatList
        data={templates}
        renderItem={({ item }) => <TemplateCard item={item} />}
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
        ref={kitListRef}
        data={tripledMedicalImages}
        renderItem={({ item }) => (
          <View style={styles.templateItem}>
            <Image source={item.source} style={styles.templateImage} />
          </View>
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 12.5 }}
        snapToAlignment="start"
        getItemLayout={(_, index) => {
          const itemWidth = wp("90%") + wp("4%");
          return {
            length: itemWidth,
            offset: itemWidth * index,
            index,
          };
        }}
        initialScrollIndex={medicalImages.length}
        onMomentumScrollEnd={(e) => {
          const offset = e.nativeEvent.contentOffset.x;
          const itemWidth = wp("90%") + wp("4%");
          const currentIndex = Math.round(offset / itemWidth);
          if (currentIndex === 0 || currentIndex === tripledMedicalImages.length - 1) {
            const middleIndex = medicalImages.length;
            kitListRef.current?.scrollToOffset({
              offset: middleIndex * itemWidth,
              animated: false,
            });
          }
        }}
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
    width: wp("90%"),
    height: hp("20%"),
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
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#333",
  },
  templateImage: {
    width: wp("90%"),
    height: hp("20%"),
    borderRadius: 10,
  },
  templateHeader: {
    flexDirection: "row",
  templateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  viewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "green",
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
  carouselContainer: {
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    marginLeft: wp("1%"),
  },
});
