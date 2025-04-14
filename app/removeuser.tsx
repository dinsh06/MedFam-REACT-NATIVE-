import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as SecureStore from "expo-secure-store";

export default function RemoveUserTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      const token = await SecureStore.getItemAsync("jwt");
      const res = await fetch("http://192.168.29.174:5000/templates", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeTemplate = async (tempname: string) => {
    try {
      const token = await SecureStore.getItemAsync("jwt");

      const res = await fetch(`http://192.168.29.174:5000/template/${tempname}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        Alert.alert("Success", "Template removed successfully");
        setTemplates((prev) => prev.filter((t) => t.tempname !== tempname));
      } else {
        Alert.alert("Error", data.message || "Failed to remove template");
      }
    } catch (err) {
      console.error("Error deleting template:", err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading templates...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={templates}
        keyExtractor={(item) => item.tempname}
        renderItem={({ item }) => (
          <View style={styles.templateCard}>
            <View style={styles.row}>
              <Text style={styles.templateName}>{item.tempname}</Text>
              <TouchableOpacity onPress={() => removeTemplate(item.tempname)}>
                <Icon name="delete-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
            <Text style={styles.detail}>Name: {item.Name}</Text>
            <Text style={styles.detail}>Phone: {item.Phone}</Text>
            <Text style={styles.detail}>
  Medicines:{" "}
  {item.medicines?.map((med: any) => `${med.name} (${med.price})`).join(", ")}
</Text>

          </View>
        )}
        ListEmptyComponent={<Text style={styles.center}>No templates found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5dc",
    padding: 16,
  },
  templateCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    elevation: 3,
  },
  templateName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  detail: {
    marginTop: 4,
    fontSize: 14,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  center: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
