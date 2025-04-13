import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import axios from "axios";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const TopHeader = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        fetchProducts(searchQuery);
      } else {
        
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const fetchProducts = async (query: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://192.168.0.103:5000/search?q=${query}`);

      setProducts(res.data.products || []);

    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

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
        style={styles.searchBar}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        mode="flat"
        theme={{ roundness: 12 }}
      />

      {loading && <ActivityIndicator size="small" color="#F79393" style={{ marginTop: 10 }} />}

      {products.length > 0 && (
        <FlatList
          horizontal
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultBox}
              onPress={() => router.push({ pathname: "/product", params: { id: item._id } })}
            >
              <Text style={styles.resultText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ marginTop: 10 }}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: wp("100%"),
    backgroundColor: "#00B894",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: Platform.OS === "android" ? hp("2%") : hp("3%"),
    paddingBottom: hp("2.5%"),
    paddingHorizontal: wp("7.5%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    marginBottom: hp("2%"),
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: hp("0%")

  },
  logo: {
    width: wp("12%"),
    height: hp("12%"),
    resizeMode: "contain",
  },
  logoText: {
    fontSize: wp("8%"),
    fontWeight: "bold",
    color: "#F79393",
    marginLeft: wp("1%"),
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("5%"),
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
  resultBox: {
    backgroundColor: "#F79393",
    paddingVertical: hp("1%"),  
    paddingHorizontal: wp("4%"),   
    marginRight: wp("2%"),
    borderRadius: 12,
    elevation: 2,
  },
  
  resultText: {
    color: "#dedebb",
    fontWeight: "bold",
  },
});

export default TopHeader;
