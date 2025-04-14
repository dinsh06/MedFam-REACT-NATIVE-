import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

  // Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://192.168.29.174:5000/product/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
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
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
  }, []);

  const handleAddToCart = async () => {
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
        setCart([...cart, { ...product, quantity: 1 }]);
      } else {
        console.error("Failed to add product to cart:", data.message);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const handleUpdateQuantity = async (quantityChange: number) => {
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
          quantityChange: quantityChange,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const existingItem = cart.find((item) => item.name === product.name);
        const updatedQuantity = existingItem.quantity + quantityChange;

        if (updatedQuantity <= 0) {
          setCart(cart.filter((item) => item.name !== product.name));
        } else {
          setCart(
            cart.map((item) =>
              item.name === product.name
                ? { ...item, quantity: updatedQuantity }
                : item
            )
          );
        }
      } else {
        console.error("Failed to update cart:", data.message);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  if (!product) {
    return (
      <ActivityIndicator
        size="large"
        color="#F79393"
        style={{ marginTop: 40 }}
      />
    );
  }

  const cartItem = cart.find((item) => item.name === product.name);

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.card}>
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{product.name}</Text>
          
<View style={styles.cartActions}>
  {cartItem ? (
    <View style={styles.cartControls}>
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => handleUpdateQuantity(-1)}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantityText}>{cartItem.quantity}</Text>
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => handleUpdateQuantity(1)}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
      <Text style={styles.buttonText}>Add to Cart</Text>
    </TouchableOpacity>
  )}
</View>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.price}>₹{product.price}</Text>
          <Text style={styles.category}>Category: {product.category}</Text>
          <Text style={styles.prescription}>
            Prescription:{" "}
            <Text
              style={{
                color: product.prescription ? "#F79393" : "#00B894",
              }}
            >
              {product.prescription ? "Required" : "Not Required"}
            </Text>
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Short Description</Text>
            <Text style={styles.sectionText}>{product.shortDesc}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Composition</Text>
            <Text style={styles.sectionText}>{product.composition}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Usage</Text>
            <Text style={styles.sectionText}>{product.usage}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Storage</Text>
            <Text style={styles.sectionText}>{product.storage}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            {product.benefits.map((benefit: string, idx: number) => (
              <Text key={idx} style={styles.bulletText}>
                • {benefit}
              </Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Side Effects</Text>
            {product.sideEffects.map((effect: string, idx: number) => (
              <Text key={idx} style={styles.bulletText}>
                • {effect}
              </Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Safety Advice</Text>
            <Text style={styles.sectionText}>
              Alcohol: {product.safetyAdvice.alcohol}
            </Text>
            <Text style={styles.sectionText}>
              Pregnancy: {product.safetyAdvice.pregnancy}
            </Text>
            <Text style={styles.sectionText}>
              Breastfeeding: {product.safetyAdvice.breastfeeding}
            </Text>
            <Text style={styles.sectionText}>
              Kidney/Liver: {product.safetyAdvice.kidneyLiverIssues}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#DEDEBB",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  productImage: {
    height: 500,
    width: "100%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F79393",
    marginBottom: 10, // add this if needed
  },
  brand: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
    marginTop: 8
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00B894",
    marginVertical: 4,
  },
  category: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  prescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  section: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00B894",
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  bulletText: {
    fontSize: 14,
    color: "#444",
    paddingLeft: 8,
    lineHeight: 20,
  },
  cartActions: {
    marginTop: 10,
    alignItems: "flex-start",
  },
  cartControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartButton: {
    backgroundColor: "#00B894",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
