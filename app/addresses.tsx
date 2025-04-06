import * as React from "react";
import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';

interface Address {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  housenumber: string;
  buildingname: string;
  roadname: string;
  area: string;
  locality: string;
}

export default function Profile() {
  const navigation = useNavigation();
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    housenumber: "",
    buildingname: "",
    roadname: "",
    area: "",
    locality: "",
  });
  const [addresses, setAddresses] = useState<Address[]>([]); // Stores the list of addresses
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");

  // Fetch token when component mounts
  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await SecureStore.getItemAsync("jwt");
      setToken(fetchedToken || "");
    };
    fetchToken();
  }, []);

  // Fetch addresses after token is retrieved
  useEffect(() => {
    if (token) {
      const fetchAddresses = async () => {
        setLoading(true);
        try {
          const addressResponse = await fetch("http://192.168.29.174:5000/user/address", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!addressResponse.ok) {
            throw new Error("Failed to fetch addresses");
          }

          const addressData = await addressResponse.json();
          setAddresses(addressData.addresses);
        } catch (error) {
          Alert.alert("Failed to fetch addresses.");
        } finally {
          setLoading(false);
        }
      };

      fetchAddresses();
    }
  }, [token]); // Fetch addresses when token changes

  // Handle address form submission
  const handleSubmit = () => {
    if (
      !address.name ||
      !address.phone ||
      !address.pincode ||
      !address.housenumber ||
      !address.roadname ||
      !address.area ||
      !address.locality
    ) {
      Alert.alert("Please fill all the fields.");
      return;
    }

    // For now, adding address to the list (can later be saved to backend)
    const newAddress = { ...address, id: `${addresses.length + 1}` };
    setAddresses([...addresses, newAddress]);
    Alert.alert("Address submitted successfully");

    // Reset the form
    setAddress({
      name: "",
      phone: "",
      pincode: "",
      housenumber: "",
      buildingname: "",
      roadname: "",
      area: "",
      locality: "",
    });
  };

  // FlatList's renderItem for the address list
  const renderAddressItem = ({ item }: { item: Address }) => (
    <View style={styles.addressCard}>
      <Text style={styles.addressTitle}>{item.name}</Text>
      <Text>{item.housenumber}, {item.buildingname}</Text>
      <Text>{item.roadname}, {item.area}, {item.locality}</Text>
      <Text>Pin Code: {item.pincode}</Text>
      <Text>Mobile: {item.phone}</Text>
    </View>
  );

  return (
    <FlatList
      data={addresses}
      keyExtractor={(item) => item.name}
      ListHeaderComponent={
        <>
          <Text style={styles.header}>Addresses</Text>

          {/* List of Addresses */}
          <View style={styles.addressListContainer}>
            <Text style={styles.subHeader}>Your Addresses</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#FF6347" />
            ) : addresses.length > 0 ? (
              addresses.map((item) => renderAddressItem({ item }))
            ) : (
              <Text style={styles.noAddressesText}>No addresses added yet!</Text>
            )}
          </View>

          {/* Add New Address Button */}
          <Text style={styles.addAddressButtonText}>+ Add New Address</Text>

          {/* Address Form */}
          <View style={styles.formContainer}>
            <Text style={styles.subHeader}>Add New Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Deliver To"
              value={address.name}
              onChangeText={(text) => setAddress({ ...address, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              value={address.phone}
              onChangeText={(text) => setAddress({ ...address, phone: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Pin Code"
              keyboardType="numeric"
              value={address.pincode}
              onChangeText={(text) => setAddress({ ...address, pincode: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="House Number"
              keyboardType="numeric"
              value={address.housenumber}
              onChangeText={(text) => setAddress({ ...address, housenumber: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Building Name"
              value={address.buildingname}
              onChangeText={(text) => setAddress({ ...address, buildingname: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Road Name"
              value={address.roadname}
              onChangeText={(text) => setAddress({ ...address, roadname: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Area"
              value={address.area}
              onChangeText={(text) => setAddress({ ...address, area: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Locality"
              value={address.locality}
              onChangeText={(text) => setAddress({ ...address, locality: text })}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </>
      }
      ListFooterComponent={<View style={{ height: 20 }} />}
      renderItem={renderAddressItem}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
    alignSelf: "center",
  },
  subHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  addressListContainer: {
    marginBottom: 20,
  },
  addressCard: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noAddressesText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
  addAddressButtonText: {
    fontSize: 18,
    color: "#FF6347",
    marginTop: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  formContainer: {
    marginTop: 20,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "white",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
