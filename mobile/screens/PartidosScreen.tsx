import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Partido } from '../types';
import { API_ENDPOINTS } from '../config';

type Props = NativeStackScreenProps<RootStackParamList, 'Partidos'>;

export default function PartidosScreen({ navigation }: Props) {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartido, setSelectedPartido] = useState<Partido | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetch(API_ENDPOINTS.partidos)
      .then(response => response.json())
      .then((data: Partido[]) => {
        setPartidos(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar partidos:', error);
        setLoading(false);
      });
  }, []);

  const openModal = (partido: Partido) => {
    setSelectedPartido(partido);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPartido(null);
  };

  const openLink = (url: string | null) => {
    if (url) {
      Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
    }
  };

  const renderPartido = ({ item }: { item: Partido }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <View style={styles.cardContent}>
        {/* Logo del partido */}
        <View style={styles.logoContainer}>
          {item.logo_base64 ? (
            <Image
              source={{ uri: `data:image/png;base64,${item.logo_base64}` }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoPlaceholderText}>
                {item.siglas ? item.siglas.substring(0, 2) : '?'}
              </Text>
            </View>
          )}
        </View>

        {/* Información del partido */}
        <View style={styles.info}>
          <Text style={styles.partidoNombre} numberOfLines={2}>
            {item.nombre_partido}
          </Text>
          {item.siglas && (
            <Text style={styles.partidoSiglas}>{item.siglas}</Text>
          )}
          {item.ideologia && item.ideologia !== 'Desconocido' && (
            <View style={[styles.ideologiaBadge, getIdeologiaColor(item.ideologia)]}>
              <Text style={styles.ideologiaText}>{item.ideologia}</Text>
            </View>
          )}
        </View>

        <Text style={styles.arrow}>›</Text>
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
      <Text style={styles.title}>Partidos Políticos</Text>
      <Text style={styles.subtitle}>{partidos.length} partidos registrados</Text>

      <FlatList
        data={partidos}
        renderItem={renderPartido}
        keyExtractor={item => item.id_partido}
        contentContainerStyle={styles.list}
      />

      {/* Modal de detalle */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        {selectedPartido && (
          <ScrollView style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>✕ Cerrar</Text>
            </TouchableOpacity>

            <View style={styles.modalHeader}>
              {selectedPartido.logo_base64 ? (
                <Image
                  source={{ uri: `data:image/png;base64,${selectedPartido.logo_base64}` }}
                  style={styles.modalLogo}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.modalLogoPlaceholder}>
                  <Text style={styles.modalLogoText}>
                    {selectedPartido.siglas || '?'}
                  </Text>
                </View>
              )}
              <Text style={styles.modalTitle}>{selectedPartido.nombre_partido}</Text>
              {selectedPartido.siglas && (
                <Text style={styles.modalSiglas}>{selectedPartido.siglas}</Text>
              )}
            </View>

            <View style={styles.modalContent}>
              {selectedPartido.ideologia && (
                <DetailRow
                  label="Ideología"
                  value={selectedPartido.ideologia}
                  highlight
                />
              )}
              {selectedPartido.fecha_inscripcion && (
                <DetailRow
                  label="Fecha de Inscripción"
                  value={new Date(selectedPartido.fecha_inscripcion).toLocaleDateString('es-PE')}
                />
              )}
              {selectedPartido.direccion_legal && (
                <DetailRow label="Dirección" value={selectedPartido.direccion_legal} />
              )}
              {selectedPartido.telefonos && (
                <DetailRow label="Teléfonos" value={selectedPartido.telefonos} />
              )}
              {selectedPartido.email_contacto && (
                <DetailRow label="Email" value={selectedPartido.email_contacto} />
              )}
              {selectedPartido.sitio_web && (
                <TouchableOpacity onPress={() => openLink(selectedPartido.sitio_web)}>
                  <DetailRow label="Sitio Web" value={selectedPartido.sitio_web} link />
                </TouchableOpacity>
              )}
              {selectedPartido.personero_titular && (
                <DetailRow
                  label="Personero Titular"
                  value={selectedPartido.personero_titular}
                />
              )}
              {selectedPartido.personero_alterno && (
                <DetailRow
                  label="Personero Alterno"
                  value={selectedPartido.personero_alterno}
                />
              )}
            </View>
          </ScrollView>
        )}
      </Modal>
    </View>
  );
}

const DetailRow = ({ label, value, highlight, link }: { label: string; value: string; highlight?: boolean; link?: boolean }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, highlight && styles.detailHighlight, link && styles.detailLink]}>
      {value}
    </Text>
  </View>
);

const getIdeologiaColor = (ideologia: string) => {
  switch (ideologia) {
    case 'Izquierda':
      return { backgroundColor: '#dc3545' };
    case 'CentroIzquierda':
      return { backgroundColor: '#fd7e14' };
    case 'Centro':
      return { backgroundColor: '#ffc107' };
    case 'CentroDerecha':
      return { backgroundColor: '#0dcaf0' };
    case 'Derecha':
      return { backgroundColor: '#0d6efd' };
    default:
      return { backgroundColor: '#6c757d' };
  }
};

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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  logoContainer: {
    marginRight: 16,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6c757d',
  },
  info: {
    flex: 1,
  },
  partidoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  partidoSiglas: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  ideologiaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  ideologiaText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  arrow: {
    fontSize: 24,
    color: '#6c757d',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    alignItems: 'flex-end',
    padding: 16,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#0d6efd',
    fontWeight: '600',
  },
  modalHeader: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  modalLogo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  modalLogoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalLogoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6c757d',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSiglas: {
    fontSize: 16,
    color: '#6c757d',
  },
  modalContent: {
    padding: 24,
  },
  detailRow: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  detailHighlight: {
    fontWeight: 'bold',
    color: '#0d6efd',
  },
  detailLink: {
    color: '#0d6efd',
    textDecorationLine: 'underline',
  },
});
