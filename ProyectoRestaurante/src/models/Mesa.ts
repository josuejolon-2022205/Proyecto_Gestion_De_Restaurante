import { estadoMesa } from "../enums/EstadoMesa";

export interface Mesa {
    idMesa: number;
    estadoMesa: estadoMesa;
    numeroMesa: number;
    capacidad: number;
}