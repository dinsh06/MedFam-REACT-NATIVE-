import * as React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

// TypeScript Types for Cart Item
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const [products, setProducts] = React.useState<CartItem[]>([]); // Use the CartItem type for the products state
  const [loading, setLoading] = React.useState<boolean>(true); // For loading state
  const [error, setError] = React.useState<string | null>(null); // For error state
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null); // For authentication status
  const router = useRouter();

  // Check if the user is logged in
  React.useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync("jwt");
      if (!token) {
        router.replace("/login"); // Redirect to login if not authenticated
      } else {
        setIsAuthenticated(true);
        fetchCartData(token); // Fetch cart data if authenticated
      }
    };
    checkAuth();
  }, []);

  // Function to fetch the cart data
  const fetchCartData = async (token: string) => {
    try {
      const token = await SecureStore.getItemAsync('jwt');
      const response = await fetch("http://192.168.29.174:5000/cart", {
      method: "GET",
      headers: {
       "Content-Type": "application/json",
       "Authorization": `Bearer ${token}`,
  },
});
      const data = await response.json();
      if (response.ok) {
        setProducts(data.cart); // Assuming your API returns cart data in 'cart' field
      } else {
        setError(data.message || "Failed to fetch cart");
      }

      setLoading(false);
    } catch (err) {
      setError("An error occurred while fetching the cart");
      setLoading(false);
    }
  };

  // Function to update quantity of an item
  const updateQuantity = async (name: string, change: number) => {
    console.log("Updating item:", name, "Change:", change);  // Add this log to check values
    
    try {
      const token = await SecureStore.getItemAsync("jwt"); // Get the JWT token
      const response = await fetch("http://192.168.29.174:5000/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Add the JWT token to the request header
        },
        body: JSON.stringify({ itemId: name, quantityChange: change }), // Send item ID and quantity change
      });
    
      const data = await response.json();
    
      if (response.ok) {
        // Update the cart data with the new data from the server
        setProducts(data.cart); // Assuming your API returns the updated cart in 'cart'
      } else {
        setError(data.message || "Failed to update cart");
      }
    } catch (err) {
      setError("An error occurred while updating the cart");
    }
  };  
  const totalQuantity = products.reduce((total, product) => total + product.quantity, 0);
  const totalPrice = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const totalDiscount = 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading Cart...</Text>
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
      <FlatList
        data={products}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View key={item.name} style={styles.productContainer}>
            <View style={styles.imagePlaceholder} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>₹{item.price}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.name, -1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.name, +1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityText}>+</Text>
                </TouchableOpacity>
              </View>

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

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => router.push("/checkout")} // Navigate to checkout page
        >
          <Text style={styles.checkoutText}>Checkout ₹{totalPrice - totalDiscount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#dedebb",
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#00B894",
    borderRadius: 10,
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
  },
  imagePlaceholder: {
    width: 120,
    height: 170,
    backgroundColor: "#D3D3D3",
    borderRadius: 5,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: "#f4a261",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  detailsContainer: {
    padding: 8,
    backgroundColor: "#f4a261",
    borderRadius: 5,
    marginTop: 12,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
  },
  detailsText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  summaryContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f4a261",
    padding: 16,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 8,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
  },
  summaryDetails: {
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#555",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  checkoutButton: {
    backgroundColor: "#00B894",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
  },
  checkoutText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default Cart;