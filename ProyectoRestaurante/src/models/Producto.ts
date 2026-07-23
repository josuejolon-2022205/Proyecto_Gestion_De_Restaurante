export interface Producto {
    idProducto: number;
    nombreProducto: string;
    descripcionProducto: string;
    precio: number;
    disponibilidad: number;
    fkIdCategoria: number;
}