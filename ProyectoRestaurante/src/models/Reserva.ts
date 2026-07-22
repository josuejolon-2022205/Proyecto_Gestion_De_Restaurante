import { estadoReserva } from "../enums/EstadoReserva";

export interface Reserva{
    id_reserva: number,
    fecha_reserva: Date,
    hora_reservada: string,
    cantidad_personas: number,
    estado: estadoReserva,
    id_cliente: number,
    id_mesa: number
}