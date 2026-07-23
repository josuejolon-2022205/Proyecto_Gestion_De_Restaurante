import { estadoPedido } from "../enums/EstadoPedido";

export interface Pedido {
    idPedido: number;
    fechaPedido: string;
    horaPedido: string;
    estadoPedido: estadoPedido;
    total: number;
    fkIdCliente: number;
    fkIdMesa: number;
    fkIdEmpleado: number;
}