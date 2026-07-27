import { tipoMovimiento } from "../enums/tipoMovimiento";

export interface MovimientoInventario {
    idMovimiento: number;
    tipoMovimiento: tipoMovimiento;
    cantidad: number;
    fechaMovimiento: string;
    descripcion: string;
    fkIdIngrediente: number;
}