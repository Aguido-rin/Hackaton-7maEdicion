import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, FlatList, Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { API_ENDPOINTS } from "../config";

// Importación condicional de MapView - solo disponible en plataformas nativas
let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== "web") {
  const maps = require("react-native-maps");
  MapView = maps.default;
  Marker = maps.Marker;
}

type Props = NativeStackScreenProps<RootStackParamList, "Detalle">;

interface Centro {
  id_centro: string;
  nombre: string;
  direccion: string;
  distrito?: string;
  latitud?: number;
  longitud?: number;
}

interface Mesa {
  numero_mesa: number;
  ubicacion_detalle?: string;
}

export default function DetalleScreen({ route }: Props) {
  const { centroId } = route.params;
  const [centro, setCentro] = useState<Centro | null>(null);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [todosCentros, setTodosCentros] = useState<Centro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar información del centro
    fetch(API_ENDPOINTS.centro(centroId))
      .then((response) => response.json())
      .then((data: Centro) => {
        setCentro(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar centro:", error);
        setLoading(false);
      });

    // Cargar mesas del centro
    fetch(API_ENDPOINTS.mesas(centroId))
      .then((response) => response.json())
      .then((data: Mesa[]) => setMesas(data))
      .catch((error) => console.error("Error al cargar mesas:", error));

    // Cargar todos los centros para el mapa
    fetch(API_ENDPOINTS.centros)
      .then((response) => response.json())
      .then((data: Centro[]) => setTodosCentros(data))
      .catch((error) => console.error("Error al cargar centros:", error));
  }, [centroId]);

  const renderMesa = ({ item }: { item: Mesa }) => (
    <View style={styles.mesaItem}>
      <Text style={styles.mesaNumero}>Mesa {item.numero_mesa}</Text>
      {item.ubicacion_detalle && <Text style={styles.mesaUbicacion}> - {item.ubicacion_detalle}</Text>}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0d6efd" />
      </View>
    );
  }

  if (!centro) {
    return (
      <View style={styles.centered}>
        <Text>No se pudo cargar la información del centro</Text>
      </View>
    );
  }

  const region = {
    latitude: centro.latitud || -12.0464,
    longitude: centro.longitud || -77.0428,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <ScrollView style={styles.container}>
      {/* Panel de Información del Centro */}
      <View style={styles.infoPanel}>
        <Text style={styles.centroNombre}>{centro.nombre}</Text>
        <Text style={styles.centroDireccion}>
          {centro.direccion}
          {centro.distrito ? `, ${centro.distrito}` : ""}
        </Text>
        <Text style={styles.coordenadas}>
          Coordenadas: {centro.latitud}, {centro.longitud}
        </Text>
      </View>

      {/* Mapa - Solo disponible en plataformas nativas */}
      {Platform.OS !== "web" && centro.latitud && centro.longitud && MapView && Marker && (
        <MapView style={styles.map} initialRegion={region}>
          {/* Marcador del centro actual */}
          <Marker
            coordinate={{
              latitude: centro.latitud,
              longitude: centro.longitud,
            }}
            title={centro.nombre}
            description={centro.direccion}
            pinColor="red"
          />

          {/* Marcadores de otros centros */}
          {todosCentros
            .filter((c) => c.id_centro !== centroId && c.latitud && c.longitud)
            .map((c) => (
              <Marker
                key={c.id_centro}
                coordinate={{
                  latitude: c.latitud!,
                  longitude: c.longitud!,
                }}
                title={c.nombre}
                description={c.direccion}
              />
            ))}
        </MapView>
      )}

      {/* Lista de Mesas */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mesas de Votación</Text>
        {mesas.length > 0 ? (
          <FlatList
            data={mesas}
            renderItem={renderMesa}
            keyExtractor={(item) => item.numero_mesa.toString()}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.mesaItem}>
            <Text style={styles.noMesas}>No hay mesas registradas para este centro</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f7",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f5f7",
  },
  infoPanel: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  centroNombre: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  centroDireccion: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 8,
  },
  coordenadas: {
    fontSize: 12,
    color: "#6c757d",
  },
  map: {
    height: 320,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    overflow: "hidden",
  },
  card: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  mesaItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  mesaNumero: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  mesaUbicacion: {
    fontSize: 16,
    color: "#6c757d",
  },
  noMesas: {
    fontSize: 14,
    color: "#6c757d",
    fontStyle: "italic",
  },
});
