// app/(tabs)/index.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* IMAGEN HERO */}
      <Image
        source={{
          uri: 'https://i.postimg.cc/zf0yHDsY/voting-illustration.png',
        }}
        style={styles.heroImage}
        resizeMode="contain"
      />

      {/* TITULO */}
      <Text style={styles.title}>Comitia 2026</Text>
      <Text style={styles.subtitle}>
        Tu asistente inteligente para las Elecciones Generales del Perú.
      </Text>

      {/* ACCESOS RÁPIDOS */}
      <View style={styles.cardsContainer}>
        <HomeCard
          icon="how-to-vote"
          title="Buscar mi local de votación"
          desc="Encuentra tu centro y número de mesa."
          onPress={() => router.push('/elector')}
        />

        <HomeCard
          icon="person-search"
          title="Información para electores"
          desc="Cómo votar, consejos y normas."
          onPress={() => router.push('/elector')}
        />

        <HomeCard
          icon="badge"
          title="Miembros de mesa"
          desc="Calendario, funciones y capacitación."
          onPress={() => router.push('/miembros')}
        />

        <HomeCard
          icon="groups"
          title="Agrupaciones políticas"
          desc="Planes, candidatos y comparador."
          onPress={() => router.push('/agrupaciones')}
        />
      </View>
    </View>
  );
}

function HomeCard({ icon, title, desc, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <MaterialIcons name={icon} size={26} color="#2563eb" />
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={22} color="#6b7280" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#f9fafb',
  },
  heroImage: {
    width: '100%',
    height: 160,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#4b5563',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  cardsContainer: {
    marginTop: 10,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  cardDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 1,
  },
});
