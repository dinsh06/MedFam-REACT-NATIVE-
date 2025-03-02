import * as React from "react";
import { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet,TouchableOpacity,Alert} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RadioButton } from "react-native-paper";

export default function Profile() {
  const navigation = useNavigation();
  const [address, setAddress] = useState({
    deliverTo: "",
    mobileNumber: "",
    pinCode: "",
    houseNumber: "",
    buildingName: "",
    roadName: "",
    area: "",
    locality: "",
    addressType: "home",
  });

  const handleNumericInput = (text: string, field: keyof typeof address) => {
    const numericText = text.replace(/[^0-9]/g, "");
    setAddress({ ...address, [field]: numericText });
  };
  const handleSubmit = () => {
    if (
      !address.deliverTo ||
      !address.mobileNumber ||
      !address.pinCode ||
      !address.houseNumber ||
      !address.roadName ||
      !address.area ||
      !address.locality
    ) {
      Alert.alert("Please fill all the fields.");
      return; // Stop further execution if any field is empty
    }
  
    // If all fields are filled, show success message
    Alert.alert("Address submitted successfully");
  
    // Reset form fields after submission
    setAddress({
      deliverTo: "",
      mobileNumber: "",
      pinCode: "",
      houseNumber: "",
      buildingName: "",
      roadName: "",
      area: "",
      locality: "",
      addressType: "home",
    });
  };
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Addresses</Text>
      <View style={styles.formContainer}>
        {/* Address Form */}
        <Text style={styles.label}>Deliver To</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={address.deliverTo}
          onChangeText={(text) => setAddress({ ...address, deliverTo: text })}
        />

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          keyboardType="phone-pad"
          value={address.mobileNumber}
          onChangeText={(text) => handleNumericInput(text, "mobileNumber")}
        />

        <Text style={styles.label}>Pin Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Pin Code"
          keyboardType="numeric"
          value={address.pinCode}
          onChangeText={(text) => handleNumericInput(text, "pinCode")}
        />

        <Text style={styles.label}>House Number</Text>
        <TextInput
          style={styles.input}
          placeholder="House Number"
          keyboardType="numeric"
          value={address.houseNumber}
          onChangeText={(text) => handleNumericInput(text, "houseNumber")}
        />

        <Text style={styles.label}>Building Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Building Name"
          value={address.buildingName}
          onChangeText={(text) => setAddress({ ...address, buildingName: text })}
        />

        <Text style={styles.label}>Road Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Road Name"
          value={address.roadName}
          onChangeText={(text) => setAddress({ ...address, roadName: text })}
        />

        <Text style={styles.label}>Area</Text>
        <TextInput
          style={styles.input}
          placeholder="Area"
          value={address.area}
          onChangeText={(text) => setAddress({ ...address, area: text })}
        />

        <Text style={styles.label}>Locality</Text>
        <TextInput
          style={styles.input}
          placeholder="Locality"
          value={address.locality}
          onChangeText={(text) => setAddress({ ...address, locality: text })}
        />
                  {/* Submit Button */}
                  <View style={styles.buttonWrapper}>
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                      <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                  </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F88B88",
    padding: 20,

  },
  header:{
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    alignSelf: "center",
    shadowOpacity:0.3,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginVertical: 8,
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
  formContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
    width: "100%",
    maxWidth: 400,
    shadowOpacity:0.3,
  },
  buttonWrapper: {
    alignItems: "center", 
    marginBottom: 20, // Space at the bottom to avoid screen overflow
  },
  button: {
    backgroundColor: "#ff6347",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
