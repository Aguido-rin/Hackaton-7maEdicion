import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

// `http://192.168.18.55:5000` — cambia a la IP de tu equipo cuando pruebes en dispositivo.
const API_BASE = "http://192.168.18.55:5000";

export default function LoginScreen() {
  const router = useRouter();
  const [dni, setDni] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    if (!dni || !password) {
      Alert.alert("Faltan datos", "Ingresa DNI y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const payload = { dni, password };
      const resp = await axios.post(`${API_BASE}/api/login`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (resp.data && resp.data.success) {
        // Login correcto — navegar a mapa
        // Puedes guardar `resp.data` en un storage seguro si lo deseas
        router.push("/mapa");
      } else {
        Alert.alert("Error", resp.data?.error || "Respuesta inesperada del servidor");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err.message || "Error al autenticar";
      Alert.alert("Login fallido", msg.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Comitia App</Text>
        <Text style={styles.subtitle}>Developed by GalactcDevs </Text>
        <Image style={styles.logo} source={require("../assets/images/GalacticDevs_Logo_Blanco.png")} />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>DNI</Text>
          <TextInput
            style={styles.input}
            placeholder="12345678"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={dni}
            onChangeText={setDni}
            maxLength={8}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Iniciar Sesión</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>¿No tienes cuenta?</Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.signupLink}>Regístrate aquí</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  formContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: "#2c3e50",
  },
  loginButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  forgotPassword: {
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  footerContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  signupLink: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
});
