import * as React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as SecureStore from "expo-secure-store";

export default function Profile() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  // Check if the user is logged in
  React.useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync("jwt");
      if (!token) {
        router.replace("/login");  // Redirect to login if not authenticated
      } else {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("jwt");
    router.replace("/login"); // Redirect to login after logout
  };

  if (isAuthenticated === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* My Addresses */}
      <View style={styles.row}>
        <Link href="/addresses"><Text style={styles.text}>My Addresses</Text></Link>       
        <TouchableOpacity onPress={() => router.push("/addresses")}>
          <Icon name="map-marker" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />

      {/* My Cart */}
      <View style={styles.row}>
        <Link href="/cart"><Text style={styles.text}>My Cart</Text></Link>
        <TouchableOpacity onPress={() => router.push("/cart") }>
          <Icon name="cart" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />

      {/* My Templates */}
      <View style={styles.row}>
        <Link href="/templates"><Text style={styles.text}>My Templates</Text></Link>       
        <TouchableOpacity onPress={() => router.push("/templates")}>
          <Icon name="file-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />

      {/* Settings */}
      <View style={styles.row}>
        <Text style={styles.text}>Settings</Text>
        <TouchableOpacity>
          <Icon name="cog" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />

      {/* Logout */}
      <TouchableOpacity style={styles.row} onPress={handleLogout}>
        <Text style={styles.text}>Logout</Text>
        <Icon name="logout" size={30} color="black" />
      </TouchableOpacity>
      <View style={styles.separator} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F88B88",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  text: {
    fontSize: 18,
    color: "black",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
