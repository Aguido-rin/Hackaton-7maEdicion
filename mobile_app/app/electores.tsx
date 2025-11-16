import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const ElectoresScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Instrucciones (Elector)</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Instrucciones para Electores</Text>

        <Text style={styles.subtitle}>Recomendaciones de Seguridad</Text>
        <Text style={styles.paragraph}>
          Durante el proceso electoral, se establecen medidas de seguridad para proteger a los ciudadanos y garantizar
          un voto libre y seguro:
        </Text>

        {/* Tarjeta 1 */}
        <View style={styles.card}>
          <MaterialIcons name="security" size={24} color="#007AFF" style={styles.icon} />
          <Text style={styles.listItemText}>
            <Text style={styles.bold}>Libertad del elector:</Text> Los efectivos de las Fuerzas Armadas y la Policía
            Nacional del Perú (PNP) tienen la responsabilidad de garantizar la libertad de los ciudadanos para ejercer
            su derecho a votar sin coacción alguna.
          </Text>
        </View>

        {/* Tarjeta 2 */}
        <View style={styles.card}>
          <MaterialIcons name="no-cell" size={24} color="#007AFF" style={styles.icon} />
          <Text style={styles.listItemText}>
            <Text style={styles.bold}>Prohibición de dispositivos digitales:</Text> Está prohibido el uso de celulares,
            cámaras fotográficas y de video dentro de las aulas de votación y especialmente en la cámara secreta.
          </Text>
        </View>

        {/* Tarjeta 3 */}
        <View style={styles.card}>
          <MaterialIcons name="admin-panel-settings" size={24} color="#007AFF" style={styles.icon} />
          <Text style={styles.listItemText}>
            <Text style={styles.bold}>Inmunidad temporal:</Text> Los miembros de mesa (titulares o suplentes) y
            personeros no podrán ser apresados por ninguna autoridad desde veinticuatro horas antes hasta veinticuatro
            horas después de las elecciones, salvo caso de flagrante delito.
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
    marginBottom: 10,
    textAlign: "center",
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: "#007AFF",
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 20,
    color: "#34495e",
    lineHeight: 24,
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
    flexDirection: "row",
    alignItems: "flex-start",
  },
  icon: {
    marginRight: 15,
    marginTop: 2,
  },
  listItemText: {
    fontSize: 16,
    flex: 1,
    color: "#34495e",
    lineHeight: 24,
  },
  bold: {
    fontWeight: "bold",
    color: "#2c3e50",
  },
});

export default ElectoresScreen;
