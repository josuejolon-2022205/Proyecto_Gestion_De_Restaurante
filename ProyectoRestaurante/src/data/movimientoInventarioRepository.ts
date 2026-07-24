import { MovimientoInventario } from "../models/moviemientoInventario";
import { withTryCatch } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class MovimientoInventarioRepository {

    private async _obtenerMovimientos(): Promise<MovimientoInventario[]> {
        const result = await conexion.query("select * from movimientoInventario");
        return result.rows;
    }

    private async _obtenerMovimientoPorId(id: number): Promise<MovimientoInventario | undefined> {
        const result = await conexion.query("select * from movimientoInventario where idMovimiento = $1", [id]);
        return result.rows[0];
    }

    private async _obtenerMovimientosPorIngrediente(idIngrediente: number): Promise<MovimientoInventario[]> {
        const result = await conexion.query("select * from movimientoInventario where fkIdIngrediente = $1", [idIngrediente]);
        return result.rows;
    }

    private async _guardarMovimiento(movimiento: MovimientoInventario): Promise<void> {
        await conexion.query(
            "insert into movimientoInventario (idMovimiento, tipoMovimiento, cantidad, fechaMovimiento, descripcion, fkIdIngrediente) values ($1, $2, $3, $4, $5, $6)",
            [movimiento.idMovimiento, movimiento.tipoMovimiento, movimiento.cantidad, movimiento.fechaMovimiento, movimiento.descripcion, movimiento.fkIdIngrediente]
        );
    }

    private async _actualizarMovimiento(movimientoActualizado: MovimientoInventario): Promise<boolean> {
        const result = await conexion.query(
            "update movimientoInventario set tipoMovimiento = $1, cantidad = $2, fechaMovimiento = $3, descripcion = $4, fkIdIngrediente = $5 where idMovimiento = $6",
            [movimientoActualizado.tipoMovimiento, movimientoActualizado.cantidad, movimientoActualizado.fechaMovimiento, movimientoActualizado.descripcion, movimientoActualizado.fkIdIngrediente, movimientoActualizado.idMovimiento]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarMovimiento(id: number): Promise<boolean> {
        const result = await conexion.query("delete from movimientoInventario where idMovimiento = $1", [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerMovimientos = withTryCatch(this._obtenerMovimientos.bind(this), [], "Error al obtener movimientos de inventario.");
    obtenerMovimientoPorId = withTryCatch(this._obtenerMovimientoPorId.bind(this), undefined, "Error al buscar movimiento por ID.");
    obtenerMovimientosPorIngrediente = withTryCatch(this._obtenerMovimientosPorIngrediente.bind(this), [], "Error al buscar movimientos por ingrediente.");
    guardarMovimiento = withTryCatch(this._guardarMovimiento.bind(this), undefined, "Error al guardar el movimiento.");
    actualizarMovimiento = withTryCatch(this._actualizarMovimiento.bind(this), false, "Error al actualizar el movimiento.");
    eliminarMovimiento = withTryCatch(this._eliminarMovimiento.bind(this), false, "Error al eliminar el movimiento.");
}