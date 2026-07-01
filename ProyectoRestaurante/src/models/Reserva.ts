import { estado_reserva } from "../enums/Estado_reserva";

export interface Reserva{
    id_reserva: number,
    fecha_reserva: Date,
    hora_reservada: string,
    cantidad_personas: number,
    estado: estado_reserva,
    id_cliente: number,
    id_mesa: number
}