import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../App";
import { API_ENDPOINTS } from "../config";

type Props = BottomTabScreenProps<TabParamList, "Centros">;

interface Centro {
  id: string;
  nombre: string;
  direccion: string;
  distrito?: string;
  lat?: number;
  lon?: number;
}

export default function HomeScreen({ navigation }: Props) {
  const [centros, setCentros] = useState<Centro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar centros de votación desde el backend
    fetch(API_ENDPOINTS.centros)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Centro[]) => {
        setCentros(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar centros:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const renderCentro = ({ item }: { item: Centro }) => (
    <TouchableOpacity style={styles.listItem}>
      <Text style={styles.centroNombre}>{item.nombre}</Text>
      <View style={styles.button}>
        <Text style={styles.buttonText}>Ver</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0d6efd" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Centros de votación</Text>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text style={styles.errorSubText}>
            Asegúrate de que el backend está ejecutándose en {API_ENDPOINTS.centros}
          </Text>
        </View>
      )}
      <FlatList
        data={centros}
        renderItem={renderCentro}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f7",
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f5f7",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  errorContainer: {
    backgroundColor: "#f8d7da",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#dc3545",
  },
  errorText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#721c24",
    marginBottom: 4,
  },
  errorSubText: {
    fontSize: 12,
    color: "#721c24",
  },
  list: {
    paddingBottom: 16,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  centroNombre: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  button: {
    backgroundColor: "#0d6efd",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
