import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

// Define the product type
interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
}

export default function ProductPage() {
  // Get the search query passed from the homepage
  const { query } = useLocalSearchParams();

  // Static product data
  const products: Product[] = [
    {
      id: '1',
      name: 'Paracetamol',
      price: '5.00',
      description: 'A commonly used medicine for pain relief and fever reduction.',
    },
  ];

  // Ensure query is a string
  const searchQuery = Array.isArray(query) ? query[0] : query;

  // Initialize the product state with the correct type
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    console.log('Search Query:', searchQuery); // Check if query is received
    if (searchQuery) {
      const filteredProduct = products.find((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProduct(filteredProduct || null); // Ensure null if no product is found
    }
  }, [searchQuery]);
  

  const handleAddToCart = () => {
    console.log(`${product?.name} added to the cart`); // Using optional chaining
  };

  // Render the page only if a product is found
  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.productName}>No product found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Product Name */}
      <Text style={styles.productName}>{product.name}</Text>

      {/* Product Price */}
      <Text style={styles.productPrice}>${product.price}</Text>

      {/* Product Description */}
      <Text style={styles.productDescription}>{product.description}</Text>

      {/* Add to Cart Button */}
      <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartButton}>
        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 20,
    color: '#28a745',
    marginVertical: 10,
  },
  productDescription: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  addToCartButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
