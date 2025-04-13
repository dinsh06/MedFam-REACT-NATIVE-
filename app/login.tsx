import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter all the fields");
      return;
    }

    try {
      const response = await fetch("http://192.168.0.103:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token } = data;
        await SecureStore.setItemAsync("jwt", token);
        Alert.alert("Success", "Login successful");
        router.replace("/homepage");
      } else {
        Alert.alert("Error", data?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An error occurred during login");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.loadingScreen}>
          <Text style={styles.title}>Medfam</Text>
          <Image
            source={require("../assets/images/Logo.png")}
            style={{ width: 100, height: 100 }}
          />
          <Text style={styles.subTitle}>
            "Live the life you are aspiring for"
          </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          placeholderTextColor="gray"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="gray"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles (unchanged from before)
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#00B894",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingScreen: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#F79393",
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "center",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
  },
  subTitle: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#F79393",
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "center",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#dedebb",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    backgroundColor: "#dedebb",
    marginBottom: 15,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
  },
  button: {
    backgroundColor: "#F79393",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: "100%",
    marginTop: 30,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
