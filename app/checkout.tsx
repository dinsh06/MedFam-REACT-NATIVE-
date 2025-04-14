import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface AddressWithFormatted extends Address {
  formattedAddress: string;
}

const CheckoutPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<AddressWithFormatted[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressWithFormatted | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const token = await SecureStore.getItemAsync('jwt');
        if (!token) {
          router.replace('/login');
          return;
        }

        const cartResponse = await fetch('http://192.168.29.174:5000/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const addressResponse = await fetch('http://192.168.29.174:5000/user/address', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!cartResponse.ok || !addressResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const cartData = await cartResponse.json();
        const addressData = await addressResponse.json();

        setCartItems(cartData.cart);
        setAddresses(addressData.addresses);
      } catch (error: any) {
        setError(error.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, []);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Select an address first');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('jwt');
      if (!token) throw new Error('No token');

      const response = await fetch('http://192.168.29.174:5000/order', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          shippingAddress: selectedAddress,
          totalPrice,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Order failed');

      Alert.alert('Success', 'Order placed successfully');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Order failed');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading Checkout...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Checkout</Text>

          {cartItems.map((item) => (
            <View style={styles.itemContainer} key={item._id}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetail}>Quantity: {item.quantity}</Text>
              <Text style={styles.itemDetail}>Price: ₹{item.price}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Sticky Footer */}
        <View style={styles.bottomContainer}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedAddress?.formattedAddress}
              onValueChange={(itemValue) => {
                const selected = addresses.find((addr) => addr.formattedAddress === itemValue);
                setSelectedAddress(selected);
              }}
              style={styles.picker}
            >
              {addresses.map((addr) => (
                <Picker.Item
                  key={addr.formattedAddress}
                  label={addr.formattedAddress}
                  value={addr.formattedAddress}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.sectionTitle}>Total: ₹{totalPrice.toFixed(2)}</Text>

          <TouchableOpacity onPress={handlePlaceOrder} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#DEDEBB',
  },
  container: {
    flex: 1,
    justifyContent: "space-evenly" 
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 0,
    flexGrow: 1, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F79393',
    textAlign: 'center',
    marginBottom: 16,
    shadowOpacity: 0.1,
  },
  itemContainer: {
    backgroundColor: '#00B894',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  itemDetail: {
    fontSize: 14,
    color: '#444',
  },
  bottomContainer: {
    backgroundColor: '#f4a261',
    padding: 15,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    bottom: -32,
    marginTop: 'auto', 
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.7,
  },
  
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  buttonContainer: {
    backgroundColor: '#00B894',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CheckoutPage;
