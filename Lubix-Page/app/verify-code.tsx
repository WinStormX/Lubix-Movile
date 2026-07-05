import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useRef } from "react";
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

const VerifyCode = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email || "");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleCodeChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, "");
    if (digit.length > 1) return;

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (!email.trim()) {
      Alert.alert("Campo faltante", "Ingresa tu correo electrónico.");
      return;
    }
    if (fullCode.length !== 6) {
      Alert.alert("Código incompleto", "Ingresa el código de 6 dígitos.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/verify-email-user", {
        email: email.trim(),
        code: fullCode,
      });

      // Backend returns 200 with {verified: true} on success,
      // or {message: "..."} on wrong code (auto-sends new code)
      if (response.data?.verified) {
        router.replace("/Login");
      } else {
        // Wrong/expired code - backend auto-sent a new one
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        Alert.alert(
          "Código incorrecto",
          response.data?.message || "Se ha enviado un nuevo código a tu correo."
        );
      }
    } catch (error: any) {
      Alert.alert("Error", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email.trim()) {
      Alert.alert("Campo faltante", "Ingresa tu correo electrónico.");
      return;
    }

    try {
      setResending(true);
      // The verify endpoint auto-sends a new code when verification fails
      await api.post("/auth/verify-email-user", {
        email: email.trim(),
        code: "000000",
      });
      Alert.alert("Código reenviado", "Revisa tu correo electrónico.");
    } catch (error: any) {
      Alert.alert("Error", getErrorMessage(error));
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0b0f19" />

      <View style={styles.topNavigation}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/Login" as any)}
        >
          <Ionicons name="arrow-back" size={20} color="#00e676" />
          <Text style={styles.backButtonText}>Volver al login</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="mail-outline" size={36} color="#00e676" />
          </View>

          <Text style={styles.title}>Verifica tu correo</Text>
          <Text style={styles.subtitle}>
            Ingresa el código de 6 dígitos que enviamos a tu correo electrónico.
          </Text>

          {/* Email */}
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

          {/* Code */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Código de verificación</Text>
            <View style={styles.codeRow}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  style={[styles.codeInput, digit ? styles.codeInputFilled : null]}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress(nativeEvent.key, index)
                  }
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && { opacity: 0.7 }]}
            activeOpacity={0.8}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0b0f19" />
            ) : (
              <Text style={styles.submitButtonText}>Verificar Código</Text>
            )}
            {!loading && (
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color="#0b0f19"
                style={{ marginLeft: 6 }}
              />
            )}
          </TouchableOpacity>

          {/* Resend */}
          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendCode}
            disabled={resending}
          >
            {resending ? (
              <ActivityIndicator size="small" color="#00e676" />
            ) : (
              <>
                <Ionicons name="refresh-outline" size={16} color="#00e676" />
                <Text style={styles.resendText}>
                  {" "}Reenviar código
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿Ya verificaste? </Text>
            <TouchableOpacity
              onPress={() => router.push("/Login" as any)}
            >
              <Text style={styles.footerLink}>Inicia Sesión</Text>
            </TouchableOpacity>
          </View>
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
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1e2640",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#242f48",
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
  label: {
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: "600",
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
  codeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  codeInput: {
    width: 44,
    height: 52,
    backgroundColor: "#1e2640",
    borderWidth: 1,
    borderColor: "#242f48",
    borderRadius: 10,
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  codeInputFilled: {
    borderColor: "#00e676",
  },
  submitButton: {
    backgroundColor: "#00e676",
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 16,
  },
  submitButtonText: {
    color: "#0b0f19",
    fontSize: 15,
    fontWeight: "700",
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    height: 36,
  },
  resendText: {
    color: "#00e676",
    fontSize: 13,
    fontWeight: "600",
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
});

export default VerifyCode;
