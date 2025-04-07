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
import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Picker } from "@react-native-picker/picker"; // Assuming you're using axios to make requests

export default function Templates() {
  const [tempname, setTempname] = useState("");
  const [Name, setName] = useState("");
  const [Address, setAddress] = useState("");
  const [Phone, setPhone] = useState("");
  const [mail, setEmail] = useState("");
  const [medicines, setMedicines] = useState([{ name: "", quantity: 1, price: null }]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Function to add a new medicine input
  const addMedicine = () => {
    setMedicines([...medicines, { name: "", quantity: 1, price: null }]);
  };

  // Function to remove a medicine input
  const removeMedicine = (index: number) => {
    if (medicines.length > 1) {
      const updatedMedicines = medicines.filter((_, i) => i !== index);
      setMedicines(updatedMedicines);
    }
  };

  // Function to update the medicine name
  const updateMedicineName = (index: number, value: string) => {
    const updatedMedicines = medicines.map((medicine, i) =>
      i === index ? { ...medicine, name: value } : medicine
    );
    setMedicines(updatedMedicines);
  };

  // Function to update the medicine quantity
  const updateMedicineQuantity = (index: number, value: number) => {
    const updatedMedicines = medicines.map((medicine, i) =>
      i === index ? { ...medicine, quantity: value } : medicine
    );
    setMedicines(updatedMedicines);
  };

  // Function to validate and submit the form
  const handleSubmit = async () => {
    if (!tempname || !Name || !Address || !Phone || !mail) {
      Alert.alert("Please fill all fields.");
      return;
    }

    // Check if all medicines have valid names
    for (let medicine of medicines) {
      if (!medicine.name.trim()) {
        Alert.alert("Please make sure all medicine names are valid.");
        return;
      }
    }

    try {
      // Step 1: Fetch prices for all medicines
      const response = await fetch("http://192.168.0.102:5000/getMedicinesPrices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ medicines: medicines.map(m => m.name) }),
      });

      const data = await response.json();

      if (data.success) {
        // Step 2: Check if any medicines were not found
        const notFoundMedicines = data.notFoundMedicines;
        if (notFoundMedicines.length > 0) {
          // Show a popup with medicines not found
          Alert.alert("Medicines not found", notFoundMedicines.join(", "));
          return;
        }

        // Step 3: Assign the fetched prices to medicines
        const updatedMedicines = medicines.map((medicine, index) => ({
          ...medicine,
          price: data.prices[index],
        }));
        setMedicines(updatedMedicines);

        // Step 4: Submit the template with the prices
        const templateData = {
          tempname,
          Name,
          Address,
          Phone,
          mail,
          medicines: updatedMedicines,
        };
        const token = await SecureStore.getItemAsync("jwt");
        // Call the endpoint to save the template
        await fetch("http://192.168.0.102:5000/saveTemplate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(templateData),
        });

        Alert.alert("Template submitted successfully");

        // Reset form after successful submission
        setTempname("");
        setName("");
        setAddress("");
        setPhone("");
        setEmail("");
        setMedicines([{ name: "", quantity: 1, price: null }]);
      } else {
        // Handle any other errors
        Alert.alert("Error fetching medicine prices");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      Alert.alert("Something went wrong. Please try again.");
    }
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
              value={tempname}
              onChangeText={setTempname}
            />
          </View>

          {/* Name */}
          <Text style={styles.label}>Name</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              value={Name}
              onChangeText={setName}
            />
          </View>

          {/* Address */}
          <Text style={styles.label}>Address</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter Address"
              value={Address}
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
              value={Phone}
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
              value={mail}
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

// Add styles here (same as previous

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
    fontSize: 24,
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
    width: "28%",
  },
  dropdown: {
    marginLeft: 1, // Small margin between the number and arrow
  },
});
