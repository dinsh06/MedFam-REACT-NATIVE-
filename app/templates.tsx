import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const TemplateForm = () => {
  const [planName, setPlanName] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [medicine, setMedicine] = useState<string>('');
  const [medicines, setMedicines] = useState<string[]>([]); // ✅ typed



  const addMedicine = () => {
    if (medicine.trim()) {
      setMedicines([...medicines, medicine.trim()]);
      setMedicine('');
    }
  };

  const handleSubmit = () => {
    const formData = {
      planName,
      name,
      address,
      phone,
      email,
      medicines,
    };
    console.log('Form Data:', formData);
    // You can add logic to save this form data
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Templates</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Plan Name</Text>
        <TextInput
          placeholder="Enter Plan Name"
          style={styles.input}
          value={planName}
          onChangeText={setPlanName}
        />

        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder="Enter Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          placeholder="Enter Address"
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          placeholder="Enter Phone"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Medicines</Text>
        <View style={styles.medicineRow}>
          <TextInput
            placeholder="Medicine"
            style={[styles.input, { flex: 1, marginRight: 10 }]}
            value={medicine}
            onChangeText={setMedicine}
          />
          <TouchableOpacity style={styles.addButton} onPress={addMedicine}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.medicineList}>
          {medicines.map((item, index) => (
            <View key={index} style={styles.medicineChip}>
              <Text style={styles.medicineText}>{item}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dedebb',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F79393',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#000',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  medicineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#00B894',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  medicineList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  medicineChip: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderColor: '#00B894',
    borderWidth: 1,
  },
  medicineText: {
    fontSize: 14,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#00B894',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default TemplateForm;
