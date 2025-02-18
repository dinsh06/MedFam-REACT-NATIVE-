import * as React from "react";
import { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';

export default function Profile() {
  const navigation = useNavigation();
  const [address, setAddress] = useState({
    deliverTo: '',
    mobileNumber: '',
    pinCode: '',
    houseNumber: '',
    buildingName: '',
    roadName: '',
    area: '',
    locality: '',
    addressType: 'home',
  });

  const handleNumericInput = (text:string, field:keyof typeof address) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setAddress({ ...address, [field]: numericText });
  };

  return (
    <ScrollView style={styles.container}>
      

      {/* Address Form */}
      <Text style={styles.label}>Deliver To</Text>
      <TextInput style={styles.input} placeholder="Name" value={address.deliverTo} onChangeText={(text) => setAddress({ ...address, deliverTo: text })} />

      <Text style={styles.label}>Mobile Number</Text>
      <TextInput style={styles.input} placeholder="Mobile Number" keyboardType="phone-pad" value={address.mobileNumber} onChangeText={(text) => handleNumericInput(text, 'mobileNumber')} />

      <Text style={styles.label}>Pin Code</Text>
      <TextInput style={styles.input} placeholder="Pin Code" keyboardType="numeric" value={address.pinCode} onChangeText={(text) => handleNumericInput(text, 'pinCode')} />

      <Text style={styles.label}>House Number</Text>
      <TextInput style={styles.input} placeholder="House Number" keyboardType="numeric" value={address.houseNumber} onChangeText={(text) => handleNumericInput(text, 'houseNumber')} />

      <Text style={styles.label}>Building Name</Text>
      <TextInput style={styles.input} placeholder="Building Name" value={address.buildingName} onChangeText={(text) => setAddress({ ...address, buildingName: text })} />

      <Text style={styles.label}>Road Name</Text>
      <TextInput style={styles.input} placeholder="Road Name" value={address.roadName} onChangeText={(text) => setAddress({ ...address, roadName: text })} />

      <Text style={styles.label}>Area</Text>
      <TextInput style={styles.input} placeholder="Area" value={address.area} onChangeText={(text) => setAddress({ ...address, area: text })} />

      <Text style={styles.label}>Locality</Text>
      <TextInput style={styles.input} placeholder="Locality" value={address.locality} onChangeText={(text) => setAddress({ ...address, locality: text })} />
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F88B88',
    padding: 16,
    width:'100%'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
});
