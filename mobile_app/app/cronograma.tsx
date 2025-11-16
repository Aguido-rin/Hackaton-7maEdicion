import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

// 1. Definimos la data (extraída de tu HTML, solo 2026)
const eventsData2026 = {
  enero: [
    {
      date: "26 de Dic 2025 al 15 de Ene 2026",
      title: "Impugnaciones y resolución de tachas a la cédula de sufragio",
      icon: "⚖️",
    },
    {
      date: "22 de Enero",
      title: "Publicación definitiva del diseño de cédula para las Elecciones Generales 2026",
      icon: "🗳️",
    },
    {
      date: "29 de Enero",
      title: "Sorteo de miembros de mesa",
      icon: "🎲",
    },
    {
      date: "30 de Enero al 11 de Febrero",
      title: "Proceso de impugnación, apelaciones y resolución de tachas a miembros de mesa",
      icon: "✅",
    },
  ],
  febrero: [
    {
      date: "12 de Febrero",
      title: "Sorteo y publicación definitiva",
      icon: "📋",
      items: [
        "Sorteo de ubicación de candidaturas o símbolos en la cédula de sufragio",
        "Publicación definitiva de la lista de miembros de mesa",
        "Fecha límite para el retiro y/o renuncia de listas de candidatos",
      ],
    },
  ],
  marzo: [
    {
      date: "29 de Marzo",
      title: "1ra jornada de capacitación a miembros de mesa para las Elecciones Generales 2026",
      icon: "📚",
    },
  ],
  abril: [
    {
      date: "5 de Abril",
      title: "Simulacro y 2da capacitación",
      icon: "🎯",
      items: ["Simulacro del Sistema de Cómputo Electoral", "2da jornada de capacitación a miembros de mesa"],
    },
    {
      date: "12 de Abril",
      title: "Elecciones Generales 2026",
      icon: "🗳️",
    },
  ],
};

// 2. Definimos el orden de los meses
const months2026 = ["enero", "febrero", "marzo", "abril"];

const CronogramaScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cronograma 2026</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Elecciones Generales 2026</Text>

        {/* 3. Iteramos sobre los meses de 2026 */}
        {months2026.map((month) => (
          <View key={month} style={styles.monthContainer}>
            <Text style={styles.monthTitle}>{month.toUpperCase()}</Text>

            {/* 4. Iteramos sobre los eventos de cada mes */}
            {eventsData2026[month].map((event, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.icon}>{event.icon}</Text>
                  <Text style={styles.date}>{event.date}</Text>
                </View>
                <Text style={styles.cardTitle}>{event.title}</Text>

                {/* 5. Si el evento tiene sub-items, los mostramos */}
                {event.items && (
                  <View style={styles.subItemsContainer}>
                    {event.items.map((item, itemIndex) => (
                      <Text key={itemIndex} style={styles.subItem}>
                        • {item}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
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
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginVertical: 20,
  },
  monthContainer: {
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 10,
    paddingLeft: 5,
    textTransform: "capitalize",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  date: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#34495e",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 5,
  },
  subItemsContainer: {
    marginTop: 10,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#e0e0e0",
    marginLeft: 5,
  },
  subItem: {
    fontSize: 14,
    color: "#34495e",
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default CronogramaScreen;
