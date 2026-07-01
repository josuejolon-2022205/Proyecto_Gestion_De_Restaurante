import { Estado } from "../enums/Estado";
export interface Usuario {
    id_usuario: number;
    nombre_usuario: string;
    correo : string;
    contrasena : string;
    estado: Estado;
    id_rol: number
}