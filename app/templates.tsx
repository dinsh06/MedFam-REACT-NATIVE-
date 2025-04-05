import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Picker } from "@react-native-picker/picker"; // Import Picker component

export default function Templates() {
  const [planName, setPlanName] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [medicines, setMedicines] = useState([{ name: "", quantity: 1 }]); // Now an array of objects with name and quantity
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Function to add a new medicine input
  const addMedicine = () => {
    setMedicines([...medicines, { name: "", quantity: 1 }]); // Adding a new medicine with default quantity 1
  };

  // Function to remove a medicine input
  const removeMedicine = (index: number) => {
    if (medicines.length > 1) {
      const updatedMedicines = medicines.filter((_, i) => i !== index);
      setMedicines(updatedMedicines);
    }
  };

  // Function to update the medicine name at a specific index
  const updateMedicineName = (index: number, value: string) => {
    const updatedMedicines = medicines.map((medicine, i) =>
      i === index ? { ...medicine, name: value } : medicine
    );
    setMedicines(updatedMedicines);
  };

  // Function to update the medicine quantity at a specific index
  const updateMedicineQuantity = (index: number, value: number) => {
    const updatedMedicines = medicines.map((medicine, i) =>
      i === index ? { ...medicine, quantity: value } : medicine
    );
    setMedicines(updatedMedicines);
  };

  const handleSubmit = () => {
    if (!planName || !name || !address || !phone || !email || medicines.some(med => !med.name)) {
      Alert.alert("Please fill all fields and medicine names");
      return;
    }
    Alert.alert("Template submitted successfully");
    // Optionally, reset the form after submission
    setPlanName("");
    setName("");
    setAddress("");
    setPhone("");
    setEmail("");
    setMedicines([{ name: "", quantity: 1 }]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.header}>Templates</Text>

      {/* Add Template Button */}
      {!isFormVisible && (
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.addButton} onPress={() => setIsFormVisible(true)}>
            <Icon name="plus" size={30} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Template Form */}
      {isFormVisible && (
        <View style={styles.formContainer}>
          {/* Plan Name */}
          <Text style={styles.label}>Plan Name</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter Plan Name"
              value={planName}
              onChangeText={setPlanName}
            />
          </View>

          {/* Name */}
          <Text style={styles.label}>Name</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Address */}
          <Text style={styles.label}>Address</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter Address"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* Phone */}
          <Text style={styles.label}>Phone</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter Phone"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Medicine List */}
          <Text style={styles.label}>Medicines</Text>
          {medicines.map((medicine, index) => (
            <View key={index} style={styles.row}>
              <TextInput
                style={styles.medicineInput} 
                value={medicine.name}
                onChangeText={(text) => updateMedicineName(index, text)}
                placeholder="Enter medicine name"
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={addMedicine} style={styles.addButton}>
                  <Icon name="plus" size={24} color="white" />
                </TouchableOpacity>
                {medicines.length > 1 && (
                  <TouchableOpacity onPress={() => removeMedicine(index)} style={styles.removeButton}>
                    <Icon name="minus" size={24} color="white" />
                  </TouchableOpacity>
                )}
              </View>
              {/* Dropdown for Quantity */}
              <Picker
                selectedValue={medicine.quantity}
                style={styles.picker}
                onValueChange={(itemValue) => updateMedicineQuantity(index, itemValue)}
              >
                {[...Array(9).keys()].map((i) => (
                  <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                ))}
              </Picker>
            </View>
          ))}

          {/* Submit Button */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F88B88",
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 50,
    shadowOpacity: 0.3,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginVertical: 10,
  },
  inputWrapper: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 5,
    marginBottom: 10,
    elevation: 3,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  buttonWrapper: {
    alignItems: "center", 
    marginBottom: 20, 
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
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 4,
    borderRadius: 5,
  },
  removeButton: {
    backgroundColor: "#F44336",
    padding: 4,
    borderRadius: 5,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10, 
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  formContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
    width: "100%",
    maxWidth: 400,
  },
  medicineInput: {
    width: "55%", 
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "white",
    marginRight: 0, // No margin to the right to reduce space
    textAlign: "center",
  },
  picker: {
    height: 60,
    width: "27%",
  },
  dropdown: {
    marginLeft: 1, // Small margin between the number and arrow
  },
});
