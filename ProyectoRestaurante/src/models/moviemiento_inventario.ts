export interface movimiento_inventario{
    id_movimiento: number,
    tipo_movimiento: string,
    cantidad: number,
    fecha_movimiento: Date,
    descripcion: string,
    id_ingrediente: number
}