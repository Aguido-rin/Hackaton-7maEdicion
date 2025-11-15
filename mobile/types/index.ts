// Tipos basados en la estructura REAL de la base de datos

// Respuesta de /api/centros
export interface Centro {
  id: string; // id_centro (UUID)
  nombre: string;
  direccion: string;
  distrito: string | null;
  lat: number | null; // latitud
  lon: number | null; // longitud
}

// Respuesta de /api/mesas/:id
export interface Mesa {
  id: number; // id_mesa
  numero: string; // numero_mesa
  aula: string | null; // ubicacion_detalle
  piso: number | null;
  lat: number | null;
  lon: number | null;
}

// Respuesta de /api/partidos
export interface Partido {
  id_partido: string; // UUID
  jne_id_simbolo: number | null;
  nombre_partido: string;
  siglas: string | null;
  fecha_inscripcion: string | null; // ISO date string
  logo_base64: string | null; // Imagen en base64
  direccion_legal: string | null;
  telefonos: string | null;
  sitio_web: string | null;
  email_contacto: string | null;
  personero_titular: string | null;
  personero_alterno: string | null;
  ideologia: 'Izquierda' | 'CentroIzquierda' | 'Centro' | 'CentroDerecha' | 'Derecha' | 'Otro' | 'Desconocido' | null;
}

export interface Usuario {
  id_usuario: string; // UUID
  dni: string;
  email: string | null;
  rol: 'Elector' | 'MiembroMesa';
  id_mesa: number | null;
}

export interface EventoGeneral {
  fecha: string;
  mes: string;
  evento: string;
  destacado?: boolean;
}

export interface EventoMiembro {
  fecha: string;
  titulo: string;
  descripcion: string;
}
