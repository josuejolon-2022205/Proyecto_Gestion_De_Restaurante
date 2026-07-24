import { Pago } from "../models/Pago";
import { withTryCatch } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class PagoRepository {

    private async _obtenerPagos(): Promise<Pago[]> {
        const result = await conexion.query("select * from pago");
        return result.rows;
    }

    private async _obtenerPagoPorId(id: number): Promise<Pago | undefined> {
        const result = await conexion.query("select * from pago where idPago = $1", [id]);
        return result.rows[0];
    }

    private async _obtenerPagosPorPedido(idPedido: number): Promise<Pago[]> {
        const result = await conexion.query("select * from pago where fkIdPedido = $1", [idPedido]);
        return result.rows;
    }

    private async _guardarPago(pago: Pago): Promise<void> {
        await conexion.query(
            "insert into pago (idPago, fechaPago, monto, metodoPago, fkIdPedido) values ($1, $2, $3, $4, $5)",
            [pago.idPago, pago.fechaPago, pago.monto, pago.metodoPago, pago.fkIdPedido]
        );
    }

    private async _actualizarPago(pagoActualizado: Pago): Promise<boolean> {
        const result = await conexion.query(
            "update pago set fechaPago = $1, monto = $2, metodoPago = $3, fkIdPedido = $4 where idPago = $5",
            [pagoActualizado.fechaPago, pagoActualizado.monto, pagoActualizado.metodoPago, pagoActualizado.fkIdPedido, pagoActualizado.idPago]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarPago(id: number): Promise<boolean> {
        const result = await conexion.query("delete from pago where idPago = $1", [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerPagos = withTryCatch(this._obtenerPagos.bind(this), [], "Error al obtener pagos.");
    obtenerPagoPorId = withTryCatch(this._obtenerPagoPorId.bind(this), undefined, "Error al buscar pago por ID.");
    obtenerPagosPorPedido = withTryCatch(this._obtenerPagosPorPedido.bind(this), [], "Error al buscar pagos por pedido.");
    guardarPago = withTryCatch(this._guardarPago.bind(this), undefined, "Error al guardar el pago.");
    actualizarPago = withTryCatch(this._actualizarPago.bind(this), false, "Error al actualizar el pago.");
    eliminarPago = withTryCatch(this._eliminarPago.bind(this), false, "Error al eliminar el pago.");
}