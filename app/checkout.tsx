import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
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
  }, []);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ color: "#fff" }}>Loading Checkout...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: "#fff" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.topContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Checkout</Text>

        <Text style={styles.sectionTitle}>Order Summary:</Text>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetail}>Quantity: {item.quantity}</Text>
              <Text style={styles.itemDetail}>Price: ₹{item.price}</Text>
            </View>
          )}
        />
      </ScrollView>

      <View style={styles.bottomSheet}>
        <Text style={styles.sectionTitleDark}>Shipping Information:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedAddress}
            onValueChange={(itemValue: AddressWithFormatted | undefined) => setSelectedAddress(itemValue)}
            style={styles.picker}
          >
            {addresses.map((address) => (
              <Picker.Item
                key={address.formattedAddress}
                label={address.formattedAddress}
                value={address}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.sectionTitleDark}>Payment Information:</Text>
        <Text style={styles.darkText}>Payment method: Credit Card</Text>
        <Text style={styles.darkText}>Payment processing will be handled securely.</Text>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>₹{totalPrice}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText} onPress={handlePlaceOrder}>
            Place Order
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F88888',
  },
  topContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 130, // space for bottom sheet
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
    shadowOpacity:0.3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: 'white',
shadowOpacity:0.3,
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  itemDetail: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    elevation: 10,
  },
  pickerWrapper: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  sectionTitleDark: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#222',
  },
  darkText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  buttonContainer: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F88888',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F88888',
  },
});

export default CheckoutPage;