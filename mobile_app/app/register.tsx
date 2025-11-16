import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

const API_BASE = "http://192.168.18.55:5000"; // Ajusta según la IP de tu equipo en la red local

export default function RegisterScreen() {
  const router = useRouter();
  const [dni, setDni] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [idMesa, setIdMesa] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async () => {
    if (!dni || !password) {
      Alert.alert("Faltan datos", "Ingresa DNI y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const payload: any = { dni: dni.trim(), password };
      if (email) payload.email = email.trim();

      const resp = await axios.post(`${API_BASE}/api/register`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (resp.status === 201) {
        Alert.alert("Registrado", "Usuario creado correctamente. Inicia sesión.");
        router.push("/");
      } else {
        Alert.alert("Registro", resp.data?.error || "Respuesta inesperada del servidor");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err.message || "Error al registrar";
      Alert.alert("Registro fallido", msg.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Registro</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>DNI</Text>
          <TextInput
            style={styles.input}
            placeholder="12345678"
            value={dni}
            onChangeText={setDni}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@correo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Id de Mesa no se solicita en el registro; se mantiene opcional y nulo en el servidor hasta que se edite */}

        <TouchableOpacity style={styles.loginButton} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Registrarme</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push("/")}>
          <Text style={styles.forgotPasswordText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  contentContainer: { flexGrow: 1, justifyContent: "space-between", paddingVertical: 40 },
  headerContainer: { alignItems: "center", marginBottom: 40, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#2c3e50", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#7f8c8d" },
  formContainer: { paddingHorizontal: 20, marginBottom: 20 },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: "600", color: "#2c3e50", marginBottom: 8 },
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
  loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  forgotPassword: { alignItems: "center" },
  forgotPasswordText: { color: "#007AFF", fontSize: 14, fontWeight: "500" },
});
