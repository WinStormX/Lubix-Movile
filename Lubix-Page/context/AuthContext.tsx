import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  token: string | null;
  user: any | null;
  role: string | null;
  loading: boolean;
  login: (token: string, refreshToken: string, role: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("access_token");
        const storedRole = await AsyncStorage.getItem("role");
        const storedUser = await AsyncStorage.getItem("user");

        if (storedToken) {
          setToken(storedToken);
          setRole(storedRole);
          if (storedUser) setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Error cargando sesión", e);
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const login = async (newToken: string, newRefreshToken: string, newRole: string, newUser: any) => {
    setToken(newToken);
    setRole(newRole);
    setUser(newUser);
    await AsyncStorage.setItem("access_token", newToken);
    await AsyncStorage.setItem("refresh_token", newRefreshToken);
    await AsyncStorage.setItem("role", newRole);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = async () => {
    setToken(null);
    setRole(null);
    setUser(null);
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("refresh_token");
    await AsyncStorage.removeItem("role");
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);