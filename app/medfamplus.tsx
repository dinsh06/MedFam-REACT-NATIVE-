import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function MedFamPlus() {
  const router = useRouter();

  const handleSubscribe = () => {
    alert("Subscription Successful! 🎉");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>MedFam+ Membership</Text>

      {/* Ad Banner 
      <Image
        source={require("../assets/images/membership_banner.jpg")}
        style={styles.banner}
      />*/}

      {/* Benefits */}
      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitText}>✔️ 20% off on all medicines every month</Text>
        <Text style={styles.benefitText}>✔️ Free delivery on all orders</Text>
        <Text style={styles.benefitText}>✔️ 10% off on medical kits</Text>
      </View>

      {/* Subscribe Button */}
      <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
        <Text style={styles.subscribeButtonText}>Join Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F88B88",
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  banner: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  benefitsContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  benefitText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  subscribeButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
  },
  subscribeButtonText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
  },
});
