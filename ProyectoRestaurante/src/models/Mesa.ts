import { estadoMesa } from "../enums/EstadoMesa";

export interface Mesa{
    id_mesa: number;
    estado_mesa: estadoMesa;
    numero_mesa: number;
    capacidad: number;
}