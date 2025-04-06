import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://192.168.29.174:5000/product");
        const data = await response.json();

        if (data.success) {
          setProducts(data.products);
        } else {
          console.error("Failed to load products:", data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {products.length === 0 ? (
        <Text style={{ color: "#fff", marginTop: 20 }}>No products found.</Text>
      ) : (
        products.map((product, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.imagePlaceholder} />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.shortDesc}>{product.shortDesc}</Text>
              <View style={styles.row}>
                <Text style={styles.itemText}>Category: {product.category}</Text>
                <Text style={styles.itemText}>Brand: {product.brand}</Text>
              </View>

              <View style={styles.actionRow}>
                <View style={styles.priceBox}>
                  <Text style={styles.buttonText}>₹{product.price}</Text>
                </View>
                <View style={styles.spacer} />
                <TouchableOpacity style={styles.cartButton}>
                  <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: "#F88888",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "90%",
    marginBottom: 20,
    elevation: 4,
    alignItems: "center",
    overflow: "hidden",
  },
  imagePlaceholder: {
    width: "100%",
    height: 150,
    backgroundColor: "#ccc",
  },
  infoContainer: {
    padding: 16,
    alignItems: "center",
    width: "100%",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  shortDesc: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
  priceBox: {
    backgroundColor: "gold",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  spacer: {
    width: "20%",
  },
  cartButton: {
    backgroundColor: "lightgreen",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
});