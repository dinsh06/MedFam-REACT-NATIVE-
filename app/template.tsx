import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { scaleZetaToMatchClamps } from "react-native-reanimated/lib/typescript/animation/springUtils";

export default function TemplateDetail() {
  const { id } = useLocalSearchParams(); // We're treating 'id' as 'tempname'
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  // ✅ Calculate total once and store in variable named 
  const total = template.medicines.reduce(
    (sum: number, m: any) => sum + m.price * m.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{template.tempname}</Text>

        <Text style={styles.text}>
          <Text style={{ fontWeight: "bold" }}>Name: </Text>
          {template.Name}
        </Text>

        <Text style={styles.text}>
          <Text style={{ fontWeight: "bold" }}>Address: </Text>
          {template.Address}
        </Text>

        <Text style={styles.text}>
          <Text style={{ fontWeight: "bold" }}>Phone: </Text>
          {template.Phone}
        </Text>

        <Text style={styles.text}>
          <Text style={{ fontWeight: "bold" }}>Email: </Text>
          {template.mail}
        </Text>

        <Text style={[styles.text, { fontWeight: "bold" }]}>Medicines:</Text>
{template.medicines.map((m: any, index: number) => (
  <View
    key={index}
    style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}
  >
    <Text style={styles.text}>
      {index + 1}. {m.name} x{m.quantity}
    </Text>
    <Text style={styles.text}>
      <Text style={{fontWeight: "bold"}}>
      ₹{m.price * m.quantity}</Text>
      </Text>
  </View>
))}


        <Text style={[styles.text, { fontWeight: "bold", marginTop: 10 ,alignSelf: "flex-end"}]}>
          Total: ₹{total}
        </Text>

        <TouchableOpacity style={styles.buyButton}>
          <View style={styles.buttonContent}>
            <Text style={styles.buyButtonText}>Pay</Text>
            <Text style={styles.buyButtonText}> ₹{total}</Text>
            <Icon name="wallet" size={24} color="#fff" style={{ marginLeft: 8 }} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F88B88",
    flex: 1,
  },
  formContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
  },
  buyButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});