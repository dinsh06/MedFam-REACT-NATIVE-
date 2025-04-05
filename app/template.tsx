import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";

export default function TemplateDetail() {
  const { id } = useLocalSearchParams(); // We're treating 'id' as 'tempname'
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwt");

        const response = await fetch("http://192.168.29.174:5000/templates", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success && Array.isArray(data.templates)) {
          // Find the one matching tempname (id)
          const found = (data.templates as Array<{ tempname: string }>).find(
            (t) => t.tempname.toLowerCase() === id?.toString().toLowerCase()
          );
          

          if (found) {
            setTemplate(found);
          } else {
            Alert.alert("Not found", `No template found with name "${id}"`);
          }
        } else {
          Alert.alert("Error", data.message || "Failed to fetch templates");
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
        Alert.alert("Error", "Failed to fetch templates.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTemplates();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  if (!template) {
    return <Text style={{ padding: 20 }}>Template not found.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{template.tempname}</Text>
      <Text style={styles.text}>Name: {template.Name}</Text>
      <Text style={styles.text}>Address: {template.Address}</Text>
      <Text style={styles.text}>Phone: {template.Phone}</Text>
      <Text style={styles.text}>Email: {template.mail}</Text>
      <Text style={styles.text}>
      Medicines: {template.medicines.map((m: any) => `${m.name} x${m.quantity}`).join(", ")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
  },
});