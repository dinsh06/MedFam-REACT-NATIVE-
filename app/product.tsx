import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);

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

  if (!product) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.label}>Brand: <Text style={styles.value}>{product.brand}</Text></Text>
      <Text style={styles.label}>Price: ₹<Text style={styles.value}>{product.price}</Text></Text>
      <Text style={styles.label}>Category: <Text style={styles.value}>{product.category}</Text></Text>
      <Text style={styles.label}>Prescription: <Text style={styles.value}>{product.prescription ? "Yes" : "No"}</Text></Text>
      <Text style={styles.label}>Short Description:</Text>
      <Text style={styles.value}>{product.shortDesc}</Text>

      <Text style={styles.section}>Composition:</Text>
      <Text>{product.composition}</Text>

      <Text style={styles.section}>Usage:</Text>
      <Text>{product.usage}</Text>

      <Text style={styles.section}>Storage:</Text>
      <Text>{product.storage}</Text>

      <Text style={styles.section}>Side Effects:</Text>
      {product.sideEffects.map((effect: string, idx: number) => (
        <Text key={idx}>• {effect}</Text>
      ))}

      <Text style={styles.section}>Benefits:</Text>
      {product.benefits.map((benefit: string, idx: number) => (
        <Text key={idx}>• {benefit}</Text>
      ))}

      <Text style={styles.section}>Safety Advice:</Text>
      <Text>Alcohol: {product.safetyAdvice.alcohol}</Text>
      <Text>Pregnancy: {product.safetyAdvice.pregnancy}</Text>
      <Text>Breastfeeding: {product.safetyAdvice.breastfeeding}</Text>
      <Text>Kidney/Liver: {product.safetyAdvice.kidneyLiverIssues}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  value: {
    fontWeight: "normal",
  },
  section: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 16,
  },
});
