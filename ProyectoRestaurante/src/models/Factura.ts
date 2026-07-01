export interface Factura{
    id_factura: number,
    numero_factura: string,
    fecha_factura: Date,
    nit_cliente: string,
    nombre_facturacion: string,
    total_factura: number,
    id_pago: number
}