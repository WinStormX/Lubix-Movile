import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token de AsyncStorage a cada petición automáticamente
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Normaliza mensajes de error del backend (FastAPI)
export function getErrorMessage(error: any): string {
  const data = error?.response?.data;
  if (!data) return "Error de conexión con el servidor.";

  // FastAPI 422 validation errors: detail is an array
  if (Array.isArray(data.detail)) {
    return data.detail.map((e: any) => e.msg).join(". ");
  }

  // FastAPI other errors: detail is a string
  if (typeof data.detail === "string") {
    return data.detail;
  }

  return "Ocurrió un error inesperado.";
}

export default api;