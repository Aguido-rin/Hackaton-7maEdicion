import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();

  // Función genérica para manejar la navegación
  const handleNavigation = (ruta: string) => {
    router.push(ruta);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Principal</Text>
          <Text style={styles.subtitle}>Navega entre opciones</Text>
        </View>

        <View style={styles.menuContainer}>
          {/* Opción 1: Centros de Votación */}
          <TouchableOpacity style={styles.menuButton} onPress={() => handleNavigation("/mapa")}>
            <MaterialIcons name="map" size={30} color="#007AFF" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuButtonText}>Centros de Votación</Text>
              <Text style={styles.menuButtonDescription}>Encuentra tu local y mesa de sufragio.</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#bdc3c7" />
          </TouchableOpacity>

          {/* Opción 2: Partidos Políticos */}
          <TouchableOpacity style={styles.menuButton} onPress={() => handleNavigation("/partidos")}>
            <MaterialIcons name="group" size={30} color="#007AFF" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuButtonText}>Partidos Políticos</Text>
              <Text style={styles.menuButtonDescription}>Información y planes de gobierno.</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#bdc3c7" />
          </TouchableOpacity>

          {/* Opción 3: Candidatos */}
          <TouchableOpacity style={styles.menuButton} onPress={() => handleNavigation("/candidatos")}>
            <MaterialIcons name="person-search" size={30} color="#007AFF" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuButtonText}>Candidatos</Text>
              <Text style={styles.menuButtonDescription}>Gobernadores y Alcaldes.</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#bdc3c7" />
          </TouchableOpacity>

          {/* Opción 4: electores */}
          <TouchableOpacity style={styles.menuButton} onPress={() => handleNavigation("/electores")}>
            <MaterialIcons name="how-to-vote" size={30} color="#007AFF" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuButtonText}>Electores</Text>
              <Text style={styles.menuButtonDescription}>Instrucciones para los Votantes</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#bdc3c7" />
          </TouchableOpacity>

          {/* Opción 5: miembrosmesa */}
          <TouchableOpacity style={styles.menuButton} onPress={() => handleNavigation("/miembrosmesa")}>
            <MaterialIcons name="supervisor-account" size={30} color="#007AFF" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuButtonText}>Miembros de Mesa</Text>
              <Text style={styles.menuButtonDescription}>Instrucciones para los Miembros de mesa</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#bdc3c7" />
          </TouchableOpacity>

          {/* Opción 6: Cronograma */}
          <TouchableOpacity style={styles.menuButton} onPress={() => handleNavigation("/cronograma")}>
            <MaterialIcons name="event" size={30} color="#007AFF" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuButtonText}>Cronograma</Text>
              <Text style={styles.menuButtonDescription}>Fechas para los próximos eventos</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#bdc3c7" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 4,
  },
  menuContainer: {
    padding: 20,
  },
  menuButton: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c3e50",
  },
  menuButtonDescription: {
    fontSize: 13,
    color: "#7f8c8d",
    marginTop: 3,
  },
});
