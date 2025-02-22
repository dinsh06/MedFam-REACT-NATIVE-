import * as React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as SecureStore from 'expo-secure-store';

export default function Profile() {
  const router = useRouter();

  const handlelogout = async () => {
    await SecureStore.deleteItemAsync("jwt");
    router.replace("/login");  // Redirect to the index page after logout
  };

  return (
    <ScrollView style={styles.container}>
      {/* My Addresses */}
      <View style={styles.row}>
        <Link href="/addresses"><Text style={styles.text}>My Addresses</Text></Link>       
        <TouchableOpacity>
          <Icon name="map-marker" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />

      {/* My Cart */}
      <View style={styles.row}>
        <Text style={styles.text}>My Cart</Text>
        <TouchableOpacity>
          <Icon name="cart" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />

      {/* My Templates */}
      <View style={styles.row}>
        <Text style={styles.text}>My Templates</Text>
        <TouchableOpacity>
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
      <View style={styles.row}>
        <Text style={styles.text}>Logout</Text>
        <TouchableOpacity onPress={handlelogout}>
          <Icon name="logout" size={30} color="black" />
        </TouchableOpacity>
      </View>
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
});
