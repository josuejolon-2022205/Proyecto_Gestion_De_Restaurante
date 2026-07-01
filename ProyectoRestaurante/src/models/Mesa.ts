import { estado_mesa } from "../enums/Estado_mesa";

export interface Mesa{
    id_mesa: number;
    estado_mesa: estado_mesa;
    numero_mesa: number;
    capacidad: number;
}