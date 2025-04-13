import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';


type Medicine = {
  name: string;
  quantity: number;
  price: number | null;
};

const TemplateForm = () => {
  const [planName, setPlanName] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [medicineInput, setMedicineInput] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const addMedicine = () => {
    if (medicineInput.trim()) {
      setMedicines([...medicines, { name: medicineInput.trim(), quantity: 1, price: null }]);
      setMedicineInput('');
    }
  };

  const removeMedicine = (index: number) => {
    const updated = medicines.filter((_, i) => i !== index);
    setMedicines(updated);
  };

  const updateMedicineQuantity = (index: number, value: number) => {
    const updated = medicines.map((med, i) =>
      i === index ? { ...med, quantity: value } : med
    );
    setMedicines(updated);
  };

  const updateMedicineName = (index: number, value: string) => {
    const updated = medicines.map((med, i) =>
      i === index ? { ...med, name: value } : med
    );
    setMedicines(updated);
  };

  const handleSubmit = async () => {
    if (!planName || !name || !address || !phone || !email) {
      Alert.alert('Please fill all fields.');
      return;
    }

    for (let med of medicines) {
      if (!med.name.trim()) {
        Alert.alert('Please make sure all medicine names are valid.');
        return;
      }
    }

    try {
      const res = await fetch('http://192.168.29.174:5000/getMedicinesPrices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicines: medicines.map(m => m.name) }),
      });

      const data = await res.json();

      if (data.success) {
        const notFound = data.notFoundMedicines;
        if (notFound.length > 0) {
          Alert.alert('Medicines not found', notFound.join(', '));
          return;
        }

        const updatedMedicines = medicines.map((med, index) => ({
          ...med,
          price: data.prices[index],
        }));

        const token = await SecureStore.getItemAsync('jwt');

        const templateData = {
          planName,
          name,
          address,
          phone,
          email,
          medicines: updatedMedicines,
        };

        await fetch('http://192.168.0.102:5000/saveTemplate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(templateData),
        });

        Alert.alert('Template submitted successfully');
        setPlanName('');
        setName('');
        setAddress('');
        setPhone('');
        setEmail('');
        setMedicines([]);
      } else {
        Alert.alert('Error fetching medicine prices');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Something went wrong. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Templates</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Plan Name</Text>
        <TextInput
          style={styles.input}
          value={planName}
          onChangeText={setPlanName}
          placeholder="Enter Plan Name"
        />

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter Name"
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter Address"
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter Phone"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter Email"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Medicines</Text>
        <View style={styles.medicineRow}>
          <TextInput
            placeholder="Medicine name"
            style={[styles.input, { flex: 2, marginRight: 8 }]}
            value={medicineInput}
            onChangeText={setMedicineInput}
          />
          <TouchableOpacity style={styles.iconButton} onPress={addMedicine}>
            <Text style={styles.iconButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {medicines.map((med, index) => (
          <View key={index} style={styles.medicineRow}>
            <TextInput
              placeholder="Medicine name"
              style={[styles.input, { flex: 2, marginRight: 8 }]}
              value={med.name}
              onChangeText={(value) => updateMedicineName(index, value)}
            />

            <TouchableOpacity style={styles.iconButton} onPress={addMedicine}>
              <Text style={styles.iconButtonText}>+</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={() => removeMedicine(index)}>
              <Text style={styles.iconButtonText}>-</Text>
            </TouchableOpacity>

            <Picker
              selectedValue={med.quantity}
              onValueChange={(value) => updateMedicineQuantity(index, value)}
              style={styles.picker}
            >
              {[1, 2, 3, 4, 5].map((qty) => (
                <Picker.Item label={qty.toString()} value={qty} key={qty} />
              ))}
            </Picker>
          </View>
        ))}

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
    backgroundColor: '#00B894', // Green background
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F79393', // Coral pink
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
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
    marginBottom: 12,
  },
  iconButton: {
    backgroundColor: '#F79393',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  iconButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  picker: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: '#F79393', // Coral pink
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default TemplateForm;
