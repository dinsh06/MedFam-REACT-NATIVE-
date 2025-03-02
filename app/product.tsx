import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

// Define the product type
interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  imageUrl?: string; // Optional image URL field
}

export default function ProductPage() {
  const [quantity,setQuantity]=useState(1);
  const increaseQuantity=()=>{
    setQuantity((prev)=>prev +1);
  };
  const decreaseQuantity=()=>{
    if(quantity>1){
      setQuantity((prev)=>prev-1);
    }
  }
  // Get the search query passed from the homepage
  const { query } = useLocalSearchParams();

  // Static product data
  const products: Product[] = [
    {
      id: '1',
      name: 'Paracetamol',
      price: '25.00',
      description: 'A commonly used medicine for pain relief and fever reduction.',
      imageUrl: '', // Add image URL here if available
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
    <ScrollView style={styles.container}>
      <View style={styles.productDetails}>
      {/* Product Image (Placeholder if no image) */}
      <View style={styles.imageContainer}>
        {!product.imageUrl ? (
          <Text style={styles.imageText}>No Image Available</Text> // Placeholder text
        ) : (
          <Text>Product Image Here</Text> // Use an image if available
        )}
      </View>

      {/* Product Name */}
      <Text style={styles.productName}>{product.name}</Text>

      {/* Product Price */}
      <Text style={styles.productPrice}>₹ {product.price}</Text>

      {/* Product Description */}
      <Text style={styles.productDescription}>{product.description}</Text>
      {/*</View>*}
      
      {/* Add to Cart Button */}
       <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.quantityText}>{quantity}</Text>

        <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartButton}>
        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
      </TouchableOpacity>

      {/* Product Details Section */}
      {/*<View style={styles.productDetails}>*/}
  <Text style={styles.detailsHeader}>Product Details</Text>
  
  {/* Product Summary */}
  <Text style={styles.detailsText}><Text style={styles.detailsHeader}>Brand:</Text> Dolo 650</Text>
  <Text style={styles.detailsText}><Text style={styles.detailsHeader}>Manufacturer:</Text> Micro Labs Ltd</Text>
  <Text style={styles.detailsText}><Text style={styles.detailsHeader}>Composition:</Text> Paracetamol (650mg)</Text>
  <Text style={styles.detailsText}><Text style={styles.detailsHeader}>Storage:</Text> Store below 25°C</Text>
  <Text style={styles.detailsText}><Text style={styles.detailsHeader}>Usage:</Text> Pain relief & fever treatment</Text>
  <Text style={styles.detailsText}><Text style={styles.detailsHeader}>Available in:</Text> Packs of 10</Text>
  {/* Product Introduction */}
  <Text style={styles.detailsText}><Text style={styles.detailsHeader}>Product Introduction:</Text>{"\n"}Dolo 650 is an analgesic and antipyretic used to relieve pain and reduce fever. It is effective for headaches, toothaches, sore throats, arthritis, muscle aches, and menstrual pain. Commonly used during the COVID-19 pandemic, it should be taken with food to avoid stomach issues. Do not exceed 4 doses in 24 hours.</Text>
  
  {/* Benefits */}
  <Text style={styles.detailsText}><Text style={styles.detailsHeader}>Benefits:</Text>{"\n"}Pain relief: Effective for headache, migraine, toothache, period pain, muscle aches, and more.{"\n"}Fever relief: Reduces fever by blocking certain chemical messengers.</Text>

  {/* Side Effects */}
  <Text style={styles.detailsText}><Text style={styles.detailsHeader}>Side Effects:</Text>{"\n"}Common side effects include headache, nausea, constipation, and insomnia. These usually subside with time, but consult a doctor if they persist.</Text>

  {/* Safety Advice */}
  <Text style={styles.detailsText}><Text style={styles.detailsHeader}>Safety Advice:{"\n"}</Text> 
    <Text style={styles.detailsText}>Alcohol: Unsafe with alcohol.{"\n"}</Text>
    <Text style={styles.detailsText}>Pregnancy: Consult a doctor; may pose risks to the developing baby.{"\n"}</Text>
    <Text style={styles.detailsText}>Breastfeeding: Safe if prescribed.{"\n"}</Text>
    <Text style={styles.detailsText}>Kidney/Liver issues: Use with caution; consult a doctor for dose adjustments.{"\n"}</Text>
    {/* How to Use */}
  <Text style={styles.detailsText}><Text style={styles.detailsHeader}>{"\n"}How to Use:</Text>{"\n"}Take as prescribed by your doctor with food. Swallow whole; do not chew or break.</Text>
  </Text>

  
  
  
</View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F88B88',
    padding: 16,
    shadowOpacity: 0.3,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0', // Light grey background to indicate image space
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 8,
  },
  imageText: {
    fontSize: 16,
    color: '#888',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 22,
    color: '#28a745',
    marginVertical: 10,
    textAlign: 'center',
  },
  productDescription: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  addToCartButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDetails: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  detailsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    elevation: 3,
    marginVertical: 20,
  },
  quantityButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
    color: "#333",
  },
});
