import { DetallePedido } from "../models/DetallePedido";
import { withTryCatch } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class DetallePedidoRepository {

    private async _obtenerDetalles(): Promise<DetallePedido[]> {
        const result = await conexion.query("select * from detallePedido");
        return result.rows;
    }

    private async _obtenerDetallePorId(id: number): Promise<DetallePedido | undefined> {
        const result = await conexion.query("select * from detallePedido where idDetallePedido = $1", [id]);
        return result.rows[0];
    }

    private async _obtenerDetallesPorPedido(idPedido: number): Promise<DetallePedido[]> {
        const result = await conexion.query("select * from detallePedido where fkIdPedido = $1", [idPedido]);
        return result.rows;
    }

    private async _guardarDetalle(detalle: DetallePedido): Promise<void> {
        await conexion.query(
            "insert into detallePedido (idDetallePedido, cantidad, precioUnitario, subtotal, fkIdPedido, fkIdProducto) values ($1, $2, $3, $4, $5, $6)",
            [detalle.idDetallePedido, detalle.cantidad, detalle.precioUnitario, detalle.subtotal, detalle.fkIdPedido, detalle.fkIdProducto]
        );
    }

    private async _actualizarDetalle(detalleActualizado: DetallePedido): Promise<boolean> {
        const result = await conexion.query(
            "update detallePedido set cantidad = $1, precioUnitario = $2, subtotal = $3, fkIdPedido = $4, fkIdProducto = $5 where idDetallePedido = $6",
            [detalleActualizado.cantidad, detalleActualizado.precioUnitario, detalleActualizado.subtotal, detalleActualizado.fkIdPedido, detalleActualizado.fkIdProducto, detalleActualizado.idDetallePedido]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarDetalle(id: number): Promise<boolean> {
        const result = await conexion.query("delete from detallePedido where idDetallePedido = $1", [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerDetalles = withTryCatch(this._obtenerDetalles.bind(this), [], "Error al obtener detalles de pedido.");
    obtenerDetallePorId = withTryCatch(this._obtenerDetallePorId.bind(this), undefined, "Error al buscar detalle por ID.");
    obtenerDetallesPorPedido = withTryCatch(this._obtenerDetallesPorPedido.bind(this), [], "Error al buscar detalles por pedido.");
    guardarDetalle = withTryCatch(this._guardarDetalle.bind(this), undefined, "Error al guardar el detalle.");
    actualizarDetalle = withTryCatch(this._actualizarDetalle.bind(this), false, "Error al actualizar el detalle.");
    eliminarDetalle = withTryCatch(this._eliminarDetalle.bind(this), false, "Error al eliminar el detalle.");
}