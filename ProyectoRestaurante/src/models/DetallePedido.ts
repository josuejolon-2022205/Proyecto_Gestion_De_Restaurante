export interface DetallePedido {
    idDetallePedido: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    fkIdPedido: number;
    fkIdProducto: number;
}