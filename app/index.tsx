import { Text, View, StyleSheet, Button } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, Medfam!</Text>
      <Text>
        <Link href="/about" style={styles.button}>Go to about screen</Link>
      </Text>
      <Text>
        <Link href="/homepage" style={styles.button}>Go to Homepage</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ad2d60",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 20, // Make text readable
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
