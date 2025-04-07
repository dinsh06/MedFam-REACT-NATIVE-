import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]); // Local state for the cart items

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

  // Fetch cart data to check if items are already in the cart
  useEffect(() => {
    const fetchCart = async () => {
      const token = await SecureStore.getItemAsync("jwt");
      const response = await fetch("http://192.168.29.174:5000/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCart(data.cart);
      }
    };
    fetchCart();
  }, []);

  const handleAddToCart = async (product: any) => {
    const token = await SecureStore.getItemAsync("jwt");

    try {
      const response = await fetch("http://192.168.29.174:5000/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: product.name,
          price: product.price,
          quantity: 1,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Add the product to the cart state
        setCart([...cart, { ...product, quantity: 1 }]);
      } else {
        console.error("Failed to add product to cart:", data.message);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const handleUpdateQuantity = async (product: any, quantityChange: number) => {
    const token = await SecureStore.getItemAsync("jwt");

    try {
      const response = await fetch("http://192.168.29.174:5000/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId: product.name,
          quantityChange,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Update the cart state with the new quantity
        setCart(
          cart.map((item) =>
            item.name === product.name
              ? { ...item, quantity: item.quantity + quantityChange }
              : item
          )
        );
      } else {
        console.error("Failed to update cart:", data.message);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {products.length === 0 ? (
        <Text style={{ color: "#fff", marginTop: 20 }}>No products found.</Text>
      ) : (
        products.map((product, index) => {
          const cartItem = cart.find((item) => item.name === product.name);
          return (
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
                  {cartItem ? (
                    <View style={styles.cartControls}>
                      <TouchableOpacity
                        style={styles.cartButton}
                        onPress={() => handleUpdateQuantity(product, -1)}
                      >
                        <Text style={styles.buttonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{cartItem.quantity}</Text>
                      <TouchableOpacity
                        style={styles.cartButton}
                        onPress={() => handleUpdateQuantity(product, 1)}
                      >
                        <Text style={styles.buttonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.cartButton}
                      onPress={() => handleAddToCart(product)}
                    >
                      <Text style={styles.buttonText}>Add to Cart</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })
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
  cartControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
});
