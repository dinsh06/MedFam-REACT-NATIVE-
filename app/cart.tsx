import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import { useRouter } from 'expo-router';

const initialProducts = [
  { id: '1', name: 'Paracetamol', price: 50, quantity: 1 },
  { id: '2', name: 'Crocin', price: 40, quantity: 1 },
];

export default function Cart() {
  const [products, setProducts] = useState(initialProducts);
  const router = useRouter();

  const updateQuantity = (id: string, change: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(0, product.quantity + change) }
          : product
      )
    );
  };

  // Calculate summary information
  const totalQuantity = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const totalPrice = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  // For now, discount is 0, but you can implement your discount logic here
  const totalDiscount = 0;

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            {/* Placeholder Image */}
            <View style={styles.imagePlaceholder} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>₹{item.price}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, -1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, +1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityText}>+</Text>
                </TouchableOpacity>
              </View>

              {/* Display Item Cost, No. of Items, and Discount */}
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsText}>Quantity: {item.quantity}</Text>
                <Text style={styles.detailsText}>Item Cost: ₹{item.price * item.quantity}</Text>
                <Text style={styles.detailsText}>Discount: ₹0</Text>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 140 }}
      />

      {/* Summary Panel at Bottom */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryDetails}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Items:</Text>
            <Text style={styles.summaryValue}>{totalQuantity}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Discount:</Text>
            <Text style={styles.summaryValue}>₹{totalDiscount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount:</Text>
            <Text style={styles.summaryValue}>₹{totalPrice - totalDiscount}</Text>
          </View>
        </View>

        {/* ✅ FIXED checkoutButton */}
        <TouchableOpacity 
          style={styles.checkoutButton} 
          onPress={() => router.push("/checkout")} // Navigate to checkout page
        >
          <Text style={styles.checkoutText}>Checkout ₹{totalPrice - totalDiscount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F88B88',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 3,
  },
  imagePlaceholder: {
    width: 120,
    height: 170,
    backgroundColor: '#D3D3D3',
    borderRadius: 5,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 8,
    backgroundColor: '#F1F1F1',
    borderRadius: 5,
    marginTop: 12,
  },
  detailsText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 8,
  },
  summaryDetails: {
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#555',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  checkoutText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
