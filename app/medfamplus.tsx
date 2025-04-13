import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function MedFamPlus() {
  const router = useRouter();

  const handleSubscribe = () => {
    alert("Subscription Successful! 🎉");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Welcome to MedFam+</Text>

      {/* Optional Banner */}
      {/* 
      <Image
        source={require("../assets/images/membership_banner.jpg")}
        style={styles.banner}
      /> 
      */}

      {/* Membership Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Exclusive Benefits</Text>
        <View style={styles.benefitItem}>
          <Text style={styles.bullet}>🌟</Text>
          <Text style={styles.benefitText}>20% off on all medicines monthly</Text>
        </View>
        <View style={styles.benefitItem}>
          <Text style={styles.bullet}>🚚</Text>
          <Text style={styles.benefitText}>Free delivery on every order</Text>
        </View>
        <View style={styles.benefitItem}>
          <Text style={styles.bullet}>🩺</Text>
          <Text style={styles.benefitText}>10% off on medical kits</Text>
        </View>
      </View>

      {/* Join Button */}
      <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
        <Text style={styles.subscribeButtonText}>Join MedFam+ Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DEDEBB", // Pale beige
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#F79393", // Coral pink
    marginBottom: 20,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
  },
  banner: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    marginBottom: 30,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3, // Updated
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00B894", // Teal green
    marginBottom: 16,
    textAlign: "center",
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  bullet: {
    fontSize: 18,
    marginRight: 10,
  },
  benefitText: {
    fontSize: 18,
    color: "#333333",
    flexShrink: 1,
  },
  subscribeButton: {
    backgroundColor: "#F79393", // Coral pink
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  subscribeButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
