export interface MovimientoInventario {
    idMovimiento: number;
    tipoMovimiento: string;
    cantidad: number;
    fechaMovimiento: string;
    descripcion: string;
    fkIdIngrediente: number;
}