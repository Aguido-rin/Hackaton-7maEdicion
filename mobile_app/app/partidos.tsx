import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

// Asegúrate de que esta IP sea correcta
const API_BASE = "http://192.168.18.55:5000";

interface Partido {
  id_partido: string;
  jne_id_simbolo: number;
  nombre_partido: string;
  siglas: string | null;
  fecha_inscripcion: string | null;
  logo_base64: string | null;
  direccion_legal: string | null;
  telefonos: string | null;
  sitio_web: string | null;
  email_contacto: string | null;
  personero_titular: string | null;
  personero_alterno: string | null;
  ideologia: string | null;
}

export default function PartidosScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [filtro, setFiltro] = useState("");
  const [partidosFiltrados, setPartidosFiltrados] = useState<Partido[]>([]);

  const cargarPartidos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/partidos`);
      setPartidos(response.data);
      setPartidosFiltrados(response.data); // Inicialmente, la lista filtrada es la lista completa
    } catch (error: any) {
      console.error("Error al cargar partidos:", error);
      Alert.alert("Error", "No se pudo cargar la lista de partidos.");
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    cargarPartidos();
  }, []);

  // Efecto para filtrar la lista en el cliente
  useEffect(() => {
    if (filtro === "") {
      setPartidosFiltrados(partidos);
    } else {
      const busqueda = filtro.toLowerCase();
      const filtrados = partidos.filter(
        (partido) =>
          partido.nombre_partido.toLowerCase().includes(busqueda) || partido.siglas?.toLowerCase().includes(busqueda)
      );
      setPartidosFiltrados(filtrados);
    }
  }, [filtro, partidos]);

  const handlePressWeb = (url: string | null) => {
    if (url) {
      // Asegurarse de que la URL tenga http/https
      const fullUrl = url.startsWith("http") ? url : `https://${url}`;
      Linking.openURL(fullUrl).catch(() => {
        Alert.alert("Error", "No se puede abrir el sitio web.");
      });
    }
  };

  const renderItem = ({ item }: { item: Partido }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image
            style={styles.logo}
            source={
              item.logo_base64
                ? { uri: `data:image/jpeg;base64,${item.logo_base64}` }
                : require("../assets/images/icon.png") // Placeholder
            }
          />
          <View style={styles.headerText}>
            <Text style={styles.cardTitle}>{item.nombre_partido}</Text>
            <Text style={styles.cardSiglas}>{item.siglas || "Sin siglas"}</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <InfoRow icon="info-outline" label="Ideología" value={item.ideologia || "No definida"} />
          <InfoRow icon="location-on" label="Dirección" value={item.direccion_legal || "No registrada"} />
          <InfoRow icon="phone" label="Teléfono" value={item.telefonos || "No registrado"} />
          <InfoRow icon="person" label="Personero Titular" value={item.personero_titular || "No registrado"} />
          <TouchableOpacity
            style={styles.webButton}
            onPress={() => handlePressWeb(item.sitio_web)}
            disabled={!item.sitio_web}
          >
            <MaterialIcons name="language" size={16} color={item.sitio_web ? "#007AFF" : "#bdc3c7"} />
            <Text style={[styles.webButtonText, !item.sitio_web && styles.webButtonTextDisabled]}>Sitio Web</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Pequeño componente para las filas de información
  const InfoRow = ({ icon, label, value }: { icon: any; label: string; value: string }) => (
    <View style={styles.infoRow}>
      <MaterialIcons name={icon} size={16} color="#7f8c8d" style={styles.infoIcon} />
      <Text style={styles.cardInfo}>
        <Text style={{ fontWeight: "bold" }}>{label}:</Text> {value}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Partidos Políticos</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nombre o siglas..."
          placeholderTextColor="#999"
          value={filtro}
          onChangeText={setFiltro}
        />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#007AFF" />
      ) : (
        <FlatList
          style={styles.list}
          data={partidosFiltrados}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_partido}
          ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron partidos.</Text>}
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
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: "#2c3e50",
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  headerText: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  cardSiglas: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  cardContent: {
    padding: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  cardInfo: {
    fontSize: 13,
    color: "#34495e",
  },
});
