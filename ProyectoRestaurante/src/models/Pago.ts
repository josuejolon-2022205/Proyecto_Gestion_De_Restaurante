export interface pago{
    id_pago: number,
    fecha_pago: Date,
    monto: number,
    metodo_pago: string,
    id_pedido: number
}