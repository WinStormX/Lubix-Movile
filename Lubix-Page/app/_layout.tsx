import { Stack } from "expo-router";
import { View } from "react-native";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <View style={{ flex: 1, backgroundColor: "#0b0f19" }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="Login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="verify-code" />
          <Stack.Screen name="new-password" />
        </Stack>
      </View>
    </AuthProvider>
  );
}