import { estadoPedido } from "../enums/EstadoPedido";

export interface Pedido{
    id_pedido: number; 
    fecha_pedido: Date;
    hora_pedido: string;
    estado_pedido: estadoPedido,
    total: number,
    id_cliente: number,
    id_mesa: number,
    id_empleado:number

}