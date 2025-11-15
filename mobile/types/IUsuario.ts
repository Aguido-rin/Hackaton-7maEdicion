export interface Usuario {
  id_usuario: string;
  dni: string;
  email: string | null;
  rol: "Elector" | "MiembroMesa";
  id_mesa: number | null;
}
