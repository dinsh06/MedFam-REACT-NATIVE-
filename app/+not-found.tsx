import { View, Text, StyleSheet } from "react-native";
import { Link,Stack } from "expo-router";
import React, { Fragment } from "react";

export default function NotFoundScreen() {
  return (
    <>
    <Stack.Screen options={{title: "Not Found"}}/>
    <View style={styles.container}>
      <Text style={styles.text}>You are in the not found Page</Text>
      <Link href="/" style={styles.button}>Go to Loading Page</Link>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ad2d60",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
