import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Cronograma'>;

interface EventoGeneral {
  fecha: string;
  mes: string;
  evento: string;
  destacado?: boolean;
}

interface EventoMiembro {
  fecha: string;
  titulo: string;
  descripcion: string;
}

const eventosGenerales: EventoGeneral[] = [
  { fecha: '11/01/2026', mes: 'Enero', evento: 'Fecha límite para renuncia de candidatos y retiro de listas.' },
  { fecha: '12/01/2026', mes: 'Enero', evento: 'Fecha límite para la presentación de solicitudes de inscripción de fórmulas y listas de candidatos.' },
  { fecha: '13/01/2026', mes: 'Enero', evento: 'Fecha límite para resolver exclusiones y tachas en primera instancia.' },
  { fecha: '14/01/2026', mes: 'Enero', evento: 'Fecha límite para que las candidaturas queden inscritas.' },
  { fecha: '01/02/2026', mes: 'Febrero', evento: 'Fecha límite para publicación de fórmulas y listas admitidas.' },
  { fecha: '02/02/2026', mes: 'Febrero', evento: 'Fecha límite para exclusión por situación jurídica del candidato.' },
  { fecha: '07/02/2026', mes: 'Febrero', evento: 'Día de las Elecciones (1ra vuelta).', destacado: true },
  { fecha: '14/02/2026', mes: 'Febrero', evento: 'Fecha límite para resolver apelaciones sobre exclusión y tachas.' },
  { fecha: '15/03/2026', mes: 'Marzo', evento: 'Fecha límite para que alianzas electorales logren inscripción.' },
  { fecha: '26/04/2026', mes: 'Abril', evento: 'Día de Elecciones (2da vuelta).', destacado: true },
];

const eventosMiembros: EventoMiembro[] = [
  {
    fecha: '07/02/2026',
    titulo: 'Día de Elecciones – Primera Vuelta.',
    descripcion: 'Los miembros de mesa deben presentarse desde temprano ese día.',
  },
  {
    fecha: '26/04/2026',
    titulo: 'Día de Elecciones – Segunda Vuelta (si corresponde).',
    descripcion: 'Los mismos miembros de mesa participan nuevamente.',
  },
];

export default function CronogramaScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Cronograma Electoral 2026</Text>

      {/* Tabla General */}
      <View style={styles.card}>
        <View style={[styles.cardHeader, { backgroundColor: '#28a745' }]}>
          <Text style={styles.cardHeaderText}>Fechas Electorales Generales</Text>
        </View>
        <View style={styles.cardBody}>
          {/* Header de la tabla */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableCellHeader, { flex: 1 }]}>Fecha</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader, { flex: 1 }]}>Mes</Text>
            <Text style={[styles.tableCell, styles.tableCellHeader, { flex: 3 }]}>Evento</Text>
          </View>

          {/* Filas de la tabla */}
          {eventosGenerales.map((item, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                item.destacado && styles.tableRowDestacado,
                index % 2 === 0 && styles.tableRowEven,
              ]}
            >
              <Text style={[styles.tableCell, { flex: 1 }]}>{item.fecha}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{item.mes}</Text>
              <Text style={[styles.tableCell, { flex: 3 }]}>{item.evento}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Tabla Miembros de Mesa */}
      <View style={styles.card}>
        <View style={[styles.cardHeader, { backgroundColor: '#17a2b8' }]}>
          <Text style={styles.cardHeaderText}>Fechas Relevantes para Miembros de Mesa</Text>
        </View>
        <View style={styles.cardBody}>
          {eventosMiembros.map((item, index) => (
            <View key={index} style={[styles.miembroItem, index % 2 === 0 && styles.tableRowEven]}>
              <Text style={styles.miembroFecha}>{item.fecha}</Text>
              <Text style={styles.miembroTitulo}>{item.titulo}</Text>
              <Text style={styles.miembroDescripcion}>{item.descripcion}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 12,
  },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardBody: {
    padding: 0,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    padding: 12,
  },
  tableRowEven: {
    backgroundColor: '#f8f9fa',
  },
  tableRowDestacado: {
    backgroundColor: '#fff3cd',
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
    paddingRight: 8,
  },
  tableCellHeader: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  miembroItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  miembroFecha: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  miembroTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  miembroDescripcion: {
    fontSize: 14,
    color: '#6c757d',
  },
});
