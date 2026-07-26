import { MovimientoInventario } from "../models/moviemientoInventario";
import { withTryCatch, withTryCatchThrow } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class MovimientoInventarioRepository {

    private async _obtenerMovimientos(): Promise<MovimientoInventario[]> {
        const result = await conexion.query('select * from "movimientoInventario"');
        return result.rows;
    }

    private async _obtenerMovimientoPorId(id: number): Promise<MovimientoInventario | undefined> {
        const result = await conexion.query('select * from "movimientoInventario" where "idMovimiento" = $1', [id]);
        return result.rows[0];
    }

    private async _obtenerMovimientosPorIngrediente(idIngrediente: number): Promise<MovimientoInventario[]> {
        const result = await conexion.query('select * from "movimientoInventario" where "fkIdIngrediente" = $1', [idIngrediente]);
        return result.rows;
    }

    private async _guardarMovimiento(movimiento: Omit<MovimientoInventario, "idMovimiento">): Promise<MovimientoInventario> {
        const result = await conexion.query(
            'insert into "movimientoInventario" ("tipoMovimiento", "cantidad", "fechaMovimiento", "descripcion", "fkIdIngrediente") values ($1, $2, $3, $4, $5) returning "idMovimiento"',
            [movimiento.tipoMovimiento, movimiento.cantidad, movimiento.fechaMovimiento, movimiento.descripcion, movimiento.fkIdIngrediente]
        );
        if (!result.rows[0]) throw new Error("No se pudo obtener el id del movimiento insertado");
        return { ...movimiento, idMovimiento: result.rows[0].idMovimiento };
    }


    private async _actualizarMovimiento(movimientoActualizado: MovimientoInventario): Promise<boolean> {
        const result = await conexion.query(
            'update "movimientoInventario" set "tipoMovimiento" = $1, "cantidad" = $2, "fechaMovimiento" = $3, "descripcion" = $4, "fkIdIngrediente" = $5 where "idMovimiento" = $6',
            [movimientoActualizado.tipoMovimiento, movimientoActualizado.cantidad, movimientoActualizado.fechaMovimiento, movimientoActualizado.descripcion, movimientoActualizado.fkIdIngrediente, movimientoActualizado.idMovimiento]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarMovimiento(id: number): Promise<boolean> {
        const result = await conexion.query('delete from "movimientoInventario" where "idMovimiento" = $1', [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerMovimientos = withTryCatch(this._obtenerMovimientos.bind(this), [], "Error al obtener movimientos de inventario.");
    obtenerMovimientoPorId = withTryCatch(this._obtenerMovimientoPorId.bind(this), undefined, "Error al buscar movimiento por ID.");
    obtenerMovimientosPorIngrediente = withTryCatch(this._obtenerMovimientosPorIngrediente.bind(this), [], "Error al buscar movimientos por ingrediente.");
    guardarMovimiento = withTryCatchThrow(this._guardarMovimiento.bind(this), "Error al guardar el movimiento.");
    actualizarMovimiento = withTryCatchThrow(this._actualizarMovimiento.bind(this), "Error al actualizar el movimiento.");
    eliminarMovimiento = withTryCatchThrow(this._eliminarMovimiento.bind(this), "Error al eliminar el movimiento.");
}