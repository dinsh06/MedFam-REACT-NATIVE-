import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

interface Address {
  _id: string;
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
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [address, setAddress] = useState<Address>({
    _id: "",
    name: "",
    phone: "",
    pincode: "",
    housenumber: "",
    buildingname: "",
    roadname: "",
    area: "",
    locality: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("jwt");
      const res = await fetch("http://192.168.29.174:5000/user/address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAddresses(data.addresses);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch addresses.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const res = await fetch("http://192.168.29.174:5000/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert("Success", "Address added successfully!");
        setAddress({
          _id: "",
          name: "",
          phone: "",
          pincode: "",
          housenumber: "",
          buildingname: "",
          roadname: "",
          area: "",
          locality: "",
        });
        fetchAddresses();
      } else {
        Alert.alert("Error", data.message || "Failed to add address.");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  const renderAddressItem = ({ item }: { item: Address }) => (
    <View style={styles.addressCard}>
      <Text style={styles.addressTitle}>{item.name}</Text>
      <View style={styles.addressLine}>
        <Text style={styles.addressText}>
          {item.housenumber}
          {item.buildingname ? `, ${item.buildingname}` : ""}
        </Text>
      </View>
      <View style={styles.addressLine}>
        <Text style={styles.addressText}>
          {item.roadname}, {item.area}, {item.locality}
        </Text>
      </View>
      <View style={styles.addressDetailsRow}>
        <Text style={styles.addressDetailLabel}>📍 Pin:</Text>
        <Text style={styles.addressDetailValue}>{item.pincode}</Text>
      </View>
      <View style={styles.addressDetailsRow}>
        <Text style={styles.addressDetailLabel}>📞 Mobile:</Text>
        <Text style={styles.addressDetailValue}>{item.phone}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={addresses}
      keyExtractor={(item) => item._id}
      renderItem={renderAddressItem}
      ListHeaderComponent={
        <>
          <Text style={styles.header}>Addresses</Text>
          <Text style={styles.subHeader}>Your Saved Addresses</Text>
          {loading && <ActivityIndicator size="large" color="#00B894" />}
          {!loading && addresses.length === 0 && (
            <Text style={styles.noAddressesText}>No addresses added yet!</Text>
          )}
        </>
      }
      ListFooterComponent={
        <>
          <Text style={[styles.subHeader, { color: "#F79393" }]}>Add New Address</Text>
          <View style={styles.formContainer}>
            <Text style={styles.inputGroupHeader}>Contact Info</Text>
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
            <Text style={styles.inputGroupHeader}>Address Details</Text>
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
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dedebb",
    paddingBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00B894",
    marginVertical: 20,
    alignSelf: "center",
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "600",
    color: "#00B894",
    marginBottom: 12,
    alignSelf: "center",
  },
  noAddressesText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
  },
  addressCard: {
    backgroundColor: "#e6fff9",
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#00B894",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#005b47",
  },
  addressLine: {
    marginBottom: 4,
  },
  addressText: {
    fontSize: 15,
    color: "#333",
  },
  addressDetailsRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  addressDetailLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginRight: 5,
  },
  addressDetailValue: {
    fontSize: 14,
    color: "#333",
  },
  formContainer: {
    marginTop: 20,
    backgroundColor: "#fff2f2",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    borderColor: "#F79393",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
  },
  inputGroupHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F79393",
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginBottom: 14,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#F79393",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});