import { estadoReserva } from "../enums/EstadoReserva";

export interface Reserva {
    idReserva: number;
    fechaReserva: string;
    horaReserva: string;
    cantidadPersonas: number;
    estado: estadoReserva;
    fkIdCliente: number;
    fkIdMesa: number;
}