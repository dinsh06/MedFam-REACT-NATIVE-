import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

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
        const token = await SecureStore.getItemAsync("jwt");
        if (!token) {
          router.replace("/login");
          return;
        }

        // Fetch cart data
        const cartResponse = await fetch("http://192.168.29.174:5000/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!cartResponse.ok) {
          throw new Error("Failed to fetch cart data");
        }
        const cartData = await cartResponse.json();
        setCartItems(cartData.cart);

        // Fetch user addresses
        const addressResponse = await fetch("http://192.168.29.174:5000/user/address", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!addressResponse.ok) {
          throw new Error("Failed to fetch address");
        }
        const addressData = await addressResponse.json();
        setAddresses(addressData.addresses);

        setLoading(false);
      } catch (error: any) {
        setError(error.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, []); // Empty dependency array to run once on mount

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Handle placing the order
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert("Error", "Please select a shipping address before proceeding.");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("jwt");
      if (!token) {
        throw new Error("User not authenticated");
      }

      const orderData = {
        cartItems: cartItems,
        shippingAddress: selectedAddress,
        totalPrice: totalPrice,
      };

      const response = await fetch("http://192.168.29.174:5000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Your order has been placed successfully!");
      } else {
        throw new Error(data.message || "Failed to place the order");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong while placing the order.");
    }
  };

  // Loading and error handling UI
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
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      {/* Order Summary */}
      <Text style={styles.sectionTitle}>Order Summary:</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.name}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Price: ₹{item.price}</Text>
          </View>
        )}
      />

      <Text style={styles.totalText}>Total: ₹{totalPrice}</Text>

      {/* Shipping Information */}
      <Text style={styles.sectionTitle}>Shipping Information:</Text>
      <Picker
        selectedValue={selectedAddress}
        onValueChange={(itemValue: AddressWithFormatted | undefined) => setSelectedAddress(itemValue)} // Updated to AddressWithFormatted type
        style={styles.picker}
      >
        {addresses.map((address, index) => (
          <Picker.Item
            key={address.formattedAddress}
            label={address.formattedAddress}  // Access the formattedAddress field
            value={address}
          />
        ))}
      </Picker>

      {/* Payment Information */}
      <Text style={styles.sectionTitle}>Payment Information:</Text>
      <Text>Payment method: Credit Card</Text>
      <Text>Payment processing will be handled securely.</Text>

      {/* Place Order Button */}
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText} onPress={handlePlaceOrder}>
          Place Order
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F88B88', flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  itemContainer: {
    padding: 12,
    backgroundColor: '#ebf2ef',
    marginBottom: 10,
    borderRadius: 8,
  },
  totalText: { fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  picker: {
    height: 80,
    width: '100%',
    marginBottom: 16,
  },
  buttonContainer: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: { color: 'white', fontSize: 18, textAlign: 'center' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default CheckoutPage;
