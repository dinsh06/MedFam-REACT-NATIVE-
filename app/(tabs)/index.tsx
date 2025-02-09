import { Image, StyleSheet, View, Text, TextInput, Button, Alert} from 'react-native';
import { useState } from 'react';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const[name,setName] = useState("");
  const[age,setAge] = useState("");
  const[email,setEmail] = useState("");
  const[phone,setPhone] = useState("");
  const[address,setAddress] = useState("");
  const handleSubmit = async () => {
    if (!name || !age || !email || !phone || !address) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, age, email, phone, address }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", data.message);
        setName("");
        setAge("");
        setEmail("");
        setPhone("");
        setAddress("");
      } else {
        Alert.alert("Error", data.error || "Something went wrong!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to connect to the server.");
    }
  };

  return (
    <>
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Enter Your Details</Text>

      <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" style={{ borderBottomWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={{ borderBottomWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={{ borderBottomWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={{ borderBottomWidth: 1, marginBottom: 10 }} />

      <Button title="Submit" onPress={handleSubmit} />
    </View>
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to MedFam</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Our app is under development😅</ThemedText>
       </ThemedView>
    </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
