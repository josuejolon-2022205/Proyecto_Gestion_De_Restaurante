import { estadoMesa } from "../enums/EstadoMesa";

export interface Mesa {
    idMesa: number;
    estadoMesa: number;
    numeroMesa: number;
    capacidad: number;
}