import { estado_pedido } from "../enums/Estado_Pedido";

export interface Pedido{
    id_pedido: number; 
    fecha_pedido: Date;
    hora_pedido: string;
    estado_pedido: estado_pedido,
    total: number,
    id_cliente: number,
    id_mesa: number,
    id_empleado:number

}