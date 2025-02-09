import { Text, View, StyleSheet } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
  <Text>About Screen</Text>
</View>
  );
}
const styles=StyleSheet.create({
  container: {
    backgroundColor: "#ad2d60",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
  }});
