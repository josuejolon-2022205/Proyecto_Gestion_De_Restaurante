import { Pago } from "../models/Pago";
import { withTryCatch, withTryCatchThrow } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class PagoRepository {

    private async _obtenerPagos(): Promise<Pago[]> {
        const result = await conexion.query('select * from "pago"');
        return result.rows;
    }

    private async _obtenerPagoPorId(id: number): Promise<Pago | undefined> {
        const result = await conexion.query('select * from "pago" where "idPago" = $1', [id]);
        return result.rows[0];
    }

    private async _obtenerPagosPorPedido(idPedido: number): Promise<Pago[]> {
        const result = await conexion.query('select * from "pago" where "fkIdPedido" = $1', [idPedido]);
        return result.rows;
    }

    private async _guardarPago(pago: Omit<Pago, "idPago">): Promise<Pago> {
        const result = await conexion.query(
            'insert into "pago" ("fechaPago", "monto", "metodoPago", "fkIdPedido") values ($1, $2, $3, $4) returning "idPago"',
            [pago.fechaPago, pago.monto, pago.metodoPago, pago.fkIdPedido]
        );
        if (!result.rows[0]) throw new Error("No se pudo obtener el id del pago insertado");
        return { ...pago, idPago: result.rows[0].idPago };
    }


    private async _actualizarPago(pagoActualizado: Pago): Promise<boolean> {
        const result = await conexion.query(
            'update "pago" set "fechaPago" = $1, "monto" = $2, "metodoPago" = $3, "fkIdPedido" = $4 where "idPago" = $5',
            [pagoActualizado.fechaPago, pagoActualizado.monto, pagoActualizado.metodoPago, pagoActualizado.fkIdPedido, pagoActualizado.idPago]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarPago(id: number): Promise<boolean> {
        const result = await conexion.query('delete from "pago" where "idPago" = $1', [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerPagos = withTryCatch(this._obtenerPagos.bind(this), [], "Error al obtener pagos.");
    obtenerPagoPorId = withTryCatch(this._obtenerPagoPorId.bind(this), undefined, "Error al buscar pago por ID.");
    obtenerPagosPorPedido = withTryCatch(this._obtenerPagosPorPedido.bind(this), [], "Error al buscar pagos por pedido.");
    guardarPago = withTryCatchThrow(this._guardarPago.bind(this), "Error al guardar el pago.");
    actualizarPago = withTryCatchThrow(this._actualizarPago.bind(this), "Error al actualizar el pago.");
    eliminarPago = withTryCatchThrow(this._eliminarPago.bind(this), "Error al eliminar el pago.");
}