// Configuración de endpoints de la API
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.18.55:5000";

export const API_ENDPOINTS = {
  partidos: `${API_BASE_URL}/api/partidos`,
  centros: `${API_BASE_URL}/api/centros`,
  centro: (centroId: string) => `${API_BASE_URL}/api/centro/${centroId}`,
  mesas: (centroId: string) => `${API_BASE_URL}/api/mesas/${centroId}`,
};

export default API_ENDPOINTS;
