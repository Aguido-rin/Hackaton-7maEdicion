import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  Image,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Alert,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

// Asegúrate de que esta IP sea correcta
const API_BASE = "http://192.168.18.55:5000";

// Interface basada en la respuesta de tu API /api/candidatos
interface Candidato {
  nombre_partido: string;
  siglas_partido: string;
  foto_candidato_principal: string | null; // Base64 string
  nombre_completo: string;
  tipo_candidatura: string;
  perfil_url: string;
  region: string;
  biografia: string;
}

export default function CandidatosScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [filtroPartido, setFiltroPartido] = useState("");

  const cargarCandidatos = async (nombrePartido: string | null = null) => {
    setLoading(true);
    let url = `${API_BASE}/api/candidatos`;

    if (nombrePartido && nombrePartido.trim() !== "") {
      url += `?partido_nombre=${encodeURIComponent(nombrePartido)}`;
    }

    try {
      const response = await axios.get(url);
      setCandidatos(response.data);
    } catch (error: any) {
      console.error("Error al cargar candidatos:", error);
      Alert.alert("Error", "No se pudo cargar la lista de candidatos.");
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    cargarCandidatos();
  }, []);

  const handleVerPerfil = (url: string) => {
    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert("Error", "No se puede abrir el enlace del perfil.");
      });
    }
  };

  const renderItem = ({ item }: { item: Candidato }) => {
    // Trunca la biografía
    let biografia = item.biografia || "Biografía no disponible.";
    if (biografia.length > 100) {
      biografia = biografia.substring(0, 100) + "...";
    }

    return (
      <View style={styles.card}>
        <Image
          style={styles.cardImage}
          source={
            item.foto_candidato_principal
              ? { uri: `data:image/jpeg;base64,${item.foto_candidato_principal}` }
              : require("../assets/images/icon.png") // Un placeholder
          }
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.nombre_completo}</Text>
          <Text style={styles.cardInfo}>
            <Text style={{ fontWeight: "bold" }}>Partido:</Text> {item.nombre_partido} ({item.siglas_partido})
          </Text>
          <Text style={styles.cardInfo}>
            <Text style={{ fontWeight: "bold" }}>Región:</Text> {item.region || "No especificada"}
          </Text>
          <Text style={styles.cardInfo}>
            <Text style={{ fontWeight: "bold" }}>Postula:</Text> {item.tipo_candidatura}
          </Text>
          <Text style={styles.cardBio}>"{biografia}"</Text>
          <TouchableOpacity
            style={styles.perfilButton}
            onPress={() => handleVerPerfil(item.perfil_url)}
            disabled={!item.perfil_url}
          >
            <Text style={styles.perfilButtonText}>Ver Foto Web</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Candidatos</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nombre del candidato..."
          placeholderTextColor="#999"
          value={filtroPartido}
          onChangeText={setFiltroPartido}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => cargarCandidatos(filtroPartido)}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#007AFF" />
      ) : (
        <FlatList
          style={styles.list}
          data={candidatos}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.nombre_completo}-${index}`}
          ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron candidatos.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  backButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: "#2c3e50",
  },
  searchButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  list: {
    flex: 1,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  cardInfo: {
    fontSize: 14,
    color: "#34495e",
    marginBottom: 3,
  },
  cardBio: {
    fontSize: 13,
    color: "#7f8c8d",
    fontStyle: "italic",
    marginTop: 5,
    marginBottom: 10,
  },
  perfilButton: {
    backgroundColor: "#eef5ff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  perfilButtonText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 13,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#7f8c8d",
  },
});
