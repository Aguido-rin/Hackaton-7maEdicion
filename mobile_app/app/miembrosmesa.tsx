import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const MiembrosMesaScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cronograma para miembros de mesa</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Cronograma de la Jornada</Text>

        <View style={styles.card}>
          <Text style={styles.time}>6:00 a.m. ⏰</Text>
          <Text style={styles.description}>Los miembros de mesa deben reunirse en el local de votación asignado.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.time}>7:00 a.m. 🛠️</Text>
          <Text style={styles.description}>
            Se conforma e instala la mesa. Se inicia la revisión del material electoral recibido.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.time}>8:00 a.m. 🗳️</Text>
          <Text style={styles.description}>Inicia oficialmente la jornada de sufragio.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.time}>5:00 p.m. 🚪</Text>
          <Text style={styles.description}>
            Se cierran las puertas del local de votación. Pueden votar quienes hayan ingresado antes de esta hora.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.time}>Después de 5:00 p.m. 📊</Text>
          <Text style={styles.description}>
            Inicio del acto de escrutinio. Una vez concluido el sufragio, se inicia el acto de escrutinio.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.time}>Finalización ✅</Text>
          <Text style={styles.description}>
            Conclusión del acto de escrutinio. El acto de escrutinio finaliza cuando se han contado todos los votos. Se
            completan todas las tareas finales.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#2c3e50",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: "#007AFF",
  },
  time: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#007AFF",
  },
  description: {
    fontSize: 16,
    color: "#34495e",
    lineHeight: 24,
  },
});

export default MiembrosMesaScreen;
