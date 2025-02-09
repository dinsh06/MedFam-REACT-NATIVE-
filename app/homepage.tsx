import { Text, View, StyleSheet, Button } from "react-native";

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Homepage</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Button title="Medicines" onPress={() => alert("Medicines pressed")} />
          <Button title="Cart" onPress={() => alert("Cart pressed")} />
        </View>
        <View style={styles.row}>
          <Button title="Offers" onPress={() => alert("Offers pressed")} />
          <Button title="Profile" onPress={() => alert("Profile pressed")} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F88B88",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  table: {
    width: "80%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
});
