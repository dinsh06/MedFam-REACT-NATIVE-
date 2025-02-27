import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet ,Image} from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Show loading screen for 2 seconds, then navigate to homepage
    const timer = setTimeout(() => {
      router.replace("/homepage"); // Redirect to homepage.tsx
    }, 3000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  return (
    <View style={styles.loadingScreen}>
      <Text style={styles.loadingText}>Medfam</Text>
      <Image source={require("../assets/images/Logo.png")} style={{ width: 100, height: 100 }} />
      <Text style={{ fontStyle: "italic" }}>
  "Live the life you are aspirin for"</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: "#F88B88", // Pink background
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "green",
  },
  loadingText2:
  {
    fontSize: 20,
    fontWeight: "200",
    color: "white",
  },
});
