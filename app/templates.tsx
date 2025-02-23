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
// import DocumentPicker from "react-native-document-picker";
import * as DocumentPicker from 'expo-document-picker';


export default function Templates() {
  const [planName, setPlanName] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  // const [selectedFile, setSelectedFile] = useState<Awaited<ReturnType<typeof DocumentPicker.pickSingle>> | null>(null);





  // const pickDocument = async () => {
  //   try {
  //     const res = await DocumentPicker.pickSingle({
  //       type: [DocumentPicker.types.pdf],
  //     });
  //     setSelectedFile(res);
  //     console.log("PDF Selected:", res);
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       console.log("User cancelled the picker");
  //     } else {
  //       console.error("Error picking document:", err);
  //     }
  //   }
  // }  
  const handleSubmit = () => {
    if (!planName || !name || !address || !phone || !email) {
      Alert.alert("Please fill all fields");
      return;
    }
    Alert.alert("Template submitted successfully");
    // Optionally, reset the form after submission
    setPlanName("");
    setName("");
    setAddress("");
    setPhone("");
    setEmail("");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollViewContent}
    >
      <Text style={styles.header}>Templates</Text>

      {/* Add Template Button */}
      {!isFormVisible && (
        <TouchableOpacity style={styles.addButton} onPress={() => setIsFormVisible(true)}>
          <Icon name="plus" size={30} color="white" />
        </TouchableOpacity>
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

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
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
    alignItems: "center", // Center everything inside
    justifyContent: "center", // Center vertically
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
    marginBottom: 15,
    elevation: 3, // Add shadow to make it look like a box
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
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center",
  },
  formContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
    width: '100%', // Ensure the form takes the full width
    maxWidth: 400, // Optional: set a max width for the form
  },
});
