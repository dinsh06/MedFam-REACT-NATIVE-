import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerTitle: "Medfam" }} 
      />
      <Stack.Screen 
        name="about" 
        options={{ headerTitle: "About" }} 
      />
      <Stack.Screen 
        name="homepage" 
        options={{ headerTitle: "Homepage" }} 
      />
      <Stack.Screen 
        name="addresses" 
        options={{ headerTitle: "Addresses" }} 
      />
    </Stack>
  );
}
