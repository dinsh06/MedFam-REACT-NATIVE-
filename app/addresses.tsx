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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

interface Address {
  _id: string;
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
      const res = await fetch("http://192.168.0.103:5000/user/address", {
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
      const res = await fetch("http://192.168.0.103:5000/address", {
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
      <Text style={styles.addressText}>
        {item.housenumber}
        {item.buildingname ? `, ${item.buildingname}` : ""}
      </Text>
      <Text style={styles.addressText}>
        {item.roadname}, {item.area}, {item.locality}
      </Text>
      <Text style={styles.addressDetail}>📍 {item.pincode}</Text>
      <Text style={styles.addressDetail}>📞 {item.phone}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        contentContainerStyle={styles.innerContainer}
        data={addresses}
        keyExtractor={(item) => item._id}
        renderItem={renderAddressItem}
        ListHeaderComponent={
          <>
            <Text style={styles.header}>Your Addresses</Text>
            {loading && <ActivityIndicator size="large" color="#00B894" />}
            {!loading && addresses.length === 0 && (
              <Text style={styles.noAddressesText}>
                No addresses added yet!
              </Text>
            )}
          </>
        }
        ListFooterComponent={
          <View style={styles.formContainer}>
            <Text style={styles.subHeader}>Add New Address</Text>

            <Text style={styles.inputLabel}>Deliver To</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={address.name}
              onChangeText={(text) => setAddress({ ...address, name: text })}
            />

            <Text style={styles.inputLabel}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone"
              keyboardType="phone-pad"
              value={address.phone}
              onChangeText={(text) => setAddress({ ...address, phone: text })}
            />

            <Text style={styles.inputLabel}>Pin Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              keyboardType="numeric"
              value={address.pincode}
              onChangeText={(text) =>
                setAddress({ ...address, pincode: text })
              }
            />

            <Text style={styles.inputLabel}>House Number</Text>
            <TextInput
              style={styles.input}
              placeholder="House No."
              keyboardType="default"
              value={address.housenumber}
              onChangeText={(text) =>
                setAddress({ ...address, housenumber: text })
              }
            />

            <Text style={styles.inputLabel}>Building Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Building Name"
              value={address.buildingname}
              onChangeText={(text) =>
                setAddress({ ...address, buildingname: text })
              }
            />

            <Text style={styles.inputLabel}>Road Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Road Name"
              value={address.roadname}
              onChangeText={(text) =>
                setAddress({ ...address, roadname: text })
              }
            />

            <Text style={styles.inputLabel}>Area</Text>
            <TextInput
              style={styles.input}
              placeholder="Area"
              value={address.area}
              onChangeText={(text) => setAddress({ ...address, area: text })}
            />

            <Text style={styles.inputLabel}>Locality</Text>
            <TextInput
              style={styles.input}
              placeholder="Locality"
              value={address.locality}
              onChangeText={(text) =>
                setAddress({ ...address, locality: text })
              }
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Add Address</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DEDEBB",
  },
  innerContainer: {
    paddingBottom: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#F79393",
    alignSelf: "center",
    marginVertical: 20,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    alignSelf: "center",
  },
  noAddressesText: {
    fontSize: 16,
    color: "#F79393",
    textAlign: "center",
    marginTop: 10,
  },
  addressCard: {
    backgroundColor: "#4ED2F0",
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 15,
    color: "black",
    marginBottom: 2,
  },
  addressDetail: {
    fontSize: 14,
    color: "black",
    marginTop: 2,
  },
  formContainer: {
    backgroundColor: "#00B894",
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#F79393",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  inputLabel: {
    fontSize: 14,
    color: "black",
    marginBottom: 4,
    marginTop: 10,
    fontWeight: "500",
  },
  input: {
    height: 48,
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  submitButton: {
    backgroundColor: "#F79393",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
    elevation: 2,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
