import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView 
} from "react-native";
import { useRouter } from "expo-router";
import api, { getErrorMessage } from "../api/axios";
import { Ionicons } from "@expo/vector-icons"; // 👈 Iconos para la flecha de regresar

const NewPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const router = useRouter();

  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleResetSubmit = async () => {
    if (!email.trim()) {
      showMessage("Por favor, ingresa tu correo electrónico", "error");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/forgot-password-user", { email: email.trim() });

      showMessage("Se han enviado las instrucciones a tu correo", "success");
      
      setTimeout(() => {
        router.replace("/Login" as any);
      }, 2000);

    } catch (error: unknown) {
      showMessage(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 👈 Botón de regresar idéntico al de Register */}
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Popup de notificación */}
      {message ? (
        <View style={[
          styles.popup, 
          messageType === "success" ? styles.popupSuccess : styles.popupError
        ]}>
          <Text style={styles.popupText}>
            {messageType === "success" ? "✅ " : "❌ "}
            {message}
          </Text>
        </View>
      ) : null}

      {/* Contenedor del Formulario */}
      <View style={styles.innerContainer}>
        
        <View style={styles.headerContainer}>
          <Text style={styles.logoText}>Lubix</Text>
          <Text style={styles.subtitleText}>Recuperar Contraseña</Text>
          <Text style={styles.infoText}>
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </Text>
        </View>

        <View style={styles.formCard}>
          {/* Input Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {/* Botón de enviar */}
          <TouchableOpacity
            style={[styles.btnPrimary, loading && styles.btnDisabled]}
            onPress={handleResetSubmit}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={styles.btnText}>Enviando...</Text>
              </View>
            ) : (
              <Text style={styles.btnText}>Enviar Enlace</Text>
            )}
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827", // Fondo oscuro Slate/Gray para hacer match con Register
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 50, 
    left: 20,
    padding: 8,
    zIndex: 99, 
    backgroundColor: "#1f2937", 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#374151",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  popup: {
    position: "absolute",
    top: 50,
    left: 24,
    right: 24,
    padding: 12,
    borderRadius: 8,
    zIndex: 10,
    elevation: 4,
  },
  popupSuccess: {
    backgroundColor: "#15803d",
  },
  popupError: {
    backgroundColor: "#b91c1c",
  },
  popupText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
    textAlign: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoText: {
    fontSize: 40,
    fontWeight: "900",
    color: "#0284c7", // Azul Lubix
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "700",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    paddingHorizontal: 10,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#374151",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#e5e7eb",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#ffffff",
  },
  btnPrimary: {
    backgroundColor: "#0284c7",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default NewPassword;