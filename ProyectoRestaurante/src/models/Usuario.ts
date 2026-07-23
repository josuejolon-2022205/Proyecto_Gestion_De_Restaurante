import { Estado } from "../enums/Estado";

export interface Usuario {
    idUsuario: number;
    nombreUsuario: string;
    correo: string;
    contrasena: string;
    estado: Estado;
    fkIdRol: number;
}