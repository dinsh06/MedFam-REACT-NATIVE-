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
      const response = await fetch("http://192.168.29.174:5000/getMedicinesPrices", {
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
