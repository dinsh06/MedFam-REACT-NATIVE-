import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const initialProducts = [
  { id: '1', name: 'Paracetamol', price: 50, quantity: 1 },
  { id: '2', name: 'Crocin', price: 40, quantity: 1 },
];

export default function Cart() {
  const [products, setProducts] = useState(initialProducts);

  const updateQuantity = (id: string, change: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(0, product.quantity + change) }
          : product
      )
    );
  };

  const totalPrice = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

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
                <Text style={styles.detailsText}>No. of Items: {item.quantity}</Text>
                <Text style={styles.detailsText}>Item Cost: ₹{item.price * item.quantity}</Text>
                <Text style={styles.detailsText}>Discount: ₹0</Text>
              </View>
              {/* Checkout Button */}
      <TouchableOpacity style={styles.checkoutButton} onPress={() => alert('Proceeding to Checkout')}>
        <Text style={styles.checkoutText}>Checkout ₹{totalPrice}</Text>
      </TouchableOpacity>
            </View>
          </View>
        )}
      />
      
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
    width: 60,
    height: 60,
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
