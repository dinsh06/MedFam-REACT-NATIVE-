import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://192.168.0.103:5000/product/${id}`);
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

  if (!product) {
    return (
      <ActivityIndicator
        size="large"
        color="#F79393"
        style={{ marginTop: 40 }}
      />
    );
  }

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
  },
  brand: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
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
});
