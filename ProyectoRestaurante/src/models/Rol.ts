import { Roles } from "../enums/Roles";

export interface Rol {
    idRol: number;
    nombre: string;
    descripcion: string;
    roles: Roles;
}