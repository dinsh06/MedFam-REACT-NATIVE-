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
        options={{
          headerLeft: () => null, // Removes the back button
          gestureEnabled: false,  // Disables swipe back gesture (iOS)
          headerShown: false, // Optionally hide header entirely on homepage
        }}
      />
      <Stack.Screen
        name="addresses"
        options={{ headerTitle: "Addresses" }}
      />
      <Stack.Screen
        name="profile"
        options={{ headerTitle: "Profile" }}
      />
       <Stack.Screen
        name="templates"
        options={{ headerTitle: "templates" }}
      />
    </Stack>
  );
}

