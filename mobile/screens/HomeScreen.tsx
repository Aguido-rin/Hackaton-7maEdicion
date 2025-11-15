import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface Centro {
  id_centro: string;
  nombre: string;
  direccion?: string;
  distrito?: string;
  latitud?: number;
  longitud?: number;
}

export default function HomeScreen({ navigation }: Props) {
  const [centros, setCentros] = useState<Centro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí debes cambiar la URL por tu endpoint del backend
    fetch('http://TU_API_URL/api/centros')
      .then(response => response.json())
      .then((data: Centro[]) => {
        setCentros(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar centros:', error);
        setLoading(false);
      });
  }, []);

  const renderCentro = ({ item }: { item: Centro }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => navigation.navigate('Detalle', { centroId: item.id_centro })}
    >
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
      <FlatList
        data={centros}
        renderItem={renderCentro}
        keyExtractor={item => item.id_centro.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f5f7',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  list: {
    paddingBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  centroNombre: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  button: {
    backgroundColor: '#0d6efd',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
