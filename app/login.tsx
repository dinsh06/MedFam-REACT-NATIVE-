import * as React from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from 'react';
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
 // For storing JWT token
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handlesubmit = async() =>{
    if(!email||!password){
      Alert.alert("Enter all the fields");
      return;
    }
  try{
    const response = await fetch("http://192.168.0.109:5000/login",{
      method: "POST",
      headers:{
        "Content-type":"application/json",
      },
      body: JSON.stringify({email,password}),
    });
    const data = await response.json();
    if(response.ok){
      const {token} = data; //user's token for the session
      try {
        await SecureStore.setItemAsync("jwt", token); // Store token securely
      } catch (storeError) {
        console.log("Error storing token:", storeError);
        Alert.alert("Failed to store token securely");
        return;
      }
      Alert.alert("Login successful");
      router.replace("/homepage")
    }
    else{
      
      console.log("Login failed");
      Alert.alert("Login failed");
    }
  }  
  catch(error){
     console.log("Error occured",error);
     Alert.alert("Login failed");
  }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Email Input */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        placeholderTextColor="gray"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        placeholderTextColor="gray"
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handlesubmit}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F88B88",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "white",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "white",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#ff6347",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
