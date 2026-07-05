import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api, { getErrorMessage } from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos incompletos", "Por favor ingresa tu correo y contraseña.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/login-user", {
        email: email,
        password: password,
      });

      const { access_token, refresh_token, role, Nombre, email: userEmail } = response.data;

      // Si el correo no está verificado el backend devuelve solo un message
      if (!access_token) {
        Alert.alert(
          "Correo no verificado",
          "Se envió un nuevo código a tu correo. Verifícalo antes de iniciar sesión."
        );
        router.push(`/verify-code?email=${encodeURIComponent(email)}` as any);
        return;
      }

      await login(access_token, refresh_token, role, { Nombre, email: userEmail });

      router.replace("/Index" as any);
    } catch (error: any) {
      Alert.alert("Error", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0b0f19" />

      <View style={styles.topNavigation}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/Index" as any)}
        >
          <Ionicons name="arrow-back" size={20} color="#00e676" />
          <Text style={styles.backButtonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          <View style={styles.brandContainer}>
            <Text style={styles.logo}>Lubix</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>STORE</Text>
            </View>
          </View>

          <Text style={styles.title}>¡Bienvenido de vuelta!</Text>
          <Text style={styles.subtitle}>
            Ingresa tus credenciales para acceder a tu panel de compras premium.
          </Text>

          {/* Correo */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={18}
                color="#6b7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="ejemplo@correo.com"
                placeholderTextColor="#4b5563"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Contraseña */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Contraseña</Text>
              <TouchableOpacity onPress={() => router.push("/new-password" as any)}>
                <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#6b7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#4b5563"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Recordar sesión */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              >
                {rememberMe && (
                  <Ionicons name="checkmark" size={12} color="#0b0f19" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Recordar mi sesión</Text>
            </TouchableOpacity>
          </View>

          {/* Botón login */}
          <TouchableOpacity
            style={[styles.submitButton, loading && { opacity: 0.7 }]}
            activeOpacity={0.8}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0b0f19" />
            ) : (
              <Text style={styles.submitButtonText}>Iniciar Sesión</Text>
            )}
            {!loading && (
              <Ionicons
                name="arrow-forward"
                size={16}
                color="#0b0f19"
                style={{ marginLeft: 6 }}
              />
            )}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O CONTINÚA CON</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={18} color="#ffffff" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={18} color="#ffffff" />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿Eres nuevo en Lubix? </Text>
            <TouchableOpacity onPress={() => router.push("/register" as any)}>
              <Text style={styles.footerLink}>Crea una cuenta</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.verifyLinkRow}
            onPress={() => router.push("/verify-code" as any)}
          >
            <Ionicons name="shield-checkmark-outline" size={14} color="#9ca3af" />
            <Text style={styles.verifyLinkText}> ¿No has recibido el código? Verifica aquí</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#0b0f19",
  },
  topNavigation: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#151b2c",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#00e676",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  formCard: {
    backgroundColor: "#151b2c",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#242f48",
    alignItems: "center",
    width: "100%",
    maxWidth: 345,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#00e676",
  },
  badge: {
    backgroundColor: "#1e2640",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: "#242f48",
  },
  badgeText: {
    color: "#00e676",
    fontSize: 9,
    fontWeight: "800",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 24,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  label: {
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  forgotText: {
    color: "#00e676",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e2640",
    borderWidth: 1,
    borderColor: "#242f48",
    borderRadius: 10,
    width: "100%",
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14,
  },
  optionsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 2,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#4b5563",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#00e676",
    borderColor: "#00e676",
  },
  checkboxLabel: {
    color: "#9ca3af",
    fontSize: 13,
  },
  submitButton: {
    backgroundColor: "#00e676",
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 24,
  },
  submitButtonText: {
    color: "#0b0f19",
    fontSize: 15,
    fontWeight: "700",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#242f48",
  },
  dividerText: {
    color: "#4b5563",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 10,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e2640",
    borderWidth: 1,
    borderColor: "#242f48",
    borderRadius: 10,
    width: "48%",
    height: 44,
  },
  socialButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 8,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    color: "#9ca3af",
    fontSize: 13,
  },
  footerLink: {
    color: "#00e676",
    fontSize: 13,
    fontWeight: "700",
  },
  verifyLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 6,
  },
  verifyLinkText: {
    color: "#9ca3af",
    fontSize: 12,
  },
});

export default Login;