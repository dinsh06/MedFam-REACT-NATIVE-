import React, { useEffect, useState } from "react"; 
import { View, Text, StyleSheet, Image, Animated } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      router.replace("/homepage");
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.loadingScreen, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Medfam</Text>
      <Image
        source={require("../assets/images/Logo.png")}
        style={styles.logo}
      />
      <Text style={styles.tagline}>
        "Live the life you are aspiring for"
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: "#00B894",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#F79393",
    marginBottom: 10,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
  },
  tagline: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#DEDEBB",
    textAlign: "center",
    paddingHorizontal: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
});
