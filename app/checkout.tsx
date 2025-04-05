import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const cartItems = [
  { id: '1', name: 'Paracetamol', price: 50, quantity: 1 },
  { id: '2', name: 'Crocin', price: 40, quantity: 1 },
];

const shippingAddress = {
  address: 'New No. 25, Old No. 50, Ram Apartments, Sardar Vallabhai Patel Road, Adyar, Chennai- 600020',
  city: 'Chennai',
  state: 'Tamil Nadu',
  zip: '600020',
};

export default function CheckoutPage() {
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      {/* Order Summary */}
      <Text style={styles.sectionTitle}>Order Summary:</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
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
      <View style={styles.itemContainer}>
        <Text>{shippingAddress.address}</Text>
        <Text>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.zip}</Text>
      </View>

      {/* Payment Information */}
      <Text style={styles.sectionTitle}>Payment Information:</Text>
      <Text>Payment method: Credit Card</Text>
      <Text>Payment processing will be handled securely.</Text>

      {/* Place Order Button */}
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Place Order</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F88B88', flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16,textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  itemContainer: {
    padding: 12,
    backgroundColor: '#ebf2ef',
    marginBottom: 10,
    borderRadius: 8,
  },
  totalText: { fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  buttonContainer: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: { color: 'white', fontSize: 18, textAlign: 'center' },
});
