import { DetallePedido } from "../models/DetallePedido";
import { withTryCatch, withTryCatchThrow } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class DetallePedidoRepository {

    private async _obtenerDetalles(): Promise<DetallePedido[]> {
        const result = await conexion.query('select * from "detallePedido"');
        return result.rows;
    }

    private async _obtenerDetallePorId(id: number): Promise<DetallePedido | undefined> {
        const result = await conexion.query(
            'select * from "detallePedido" where "idDetallePedido" = $1',
            [id]
        );
        return result.rows[0];
    }

    private async _obtenerDetallesPorPedido(idPedido: number): Promise<DetallePedido[]> {
        const result = await conexion.query(
            'select * from "detallePedido" where "fkIdPedido" = $1',
            [idPedido]
        );
        return result.rows;
    }

    private async _guardarDetalle(detalle: Omit<DetallePedido, "idDetallePedido">): Promise<DetallePedido> {
        const result = await conexion.query(
            'insert into "detallePedido" ("cantidad", "precioUnitario", "subtotal", "fkIdPedido", "fkIdProducto") values ($1, $2, $3, $4, $5) returning "idDetallePedido"',
            [detalle.cantidad, detalle.precioUnitario, detalle.subtotal, detalle.fkIdPedido, detalle.fkIdProducto]
        );
        if (!result.rows[0]) throw new Error("No se pudo obtener el id del detalle insertado");
        return { ...detalle, idDetallePedido: result.rows[0].idDetallePedido };
    }

    private async _actualizarDetalle(detalleActualizado: DetallePedido): Promise<boolean> {
        const result = await conexion.query(
            'update "detallePedido" set "cantidad" = $1, "precioUnitario" = $2, "subtotal" = $3, "fkIdPedido" = $4, "fkIdProducto" = $5 where "idDetallePedido" = $6',
            [detalleActualizado.cantidad, detalleActualizado.precioUnitario, detalleActualizado.subtotal, detalleActualizado.fkIdPedido, detalleActualizado.fkIdProducto, detalleActualizado.idDetallePedido]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarDetalle(id: number): Promise<boolean> {
        const result = await conexion.query(
            'delete from "detallePedido" where "idDetallePedido" = $1',
            [id]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerDetalles = withTryCatch(this._obtenerDetalles.bind(this), [], "Error al obtener detalles de pedido.");
    obtenerDetallePorId = withTryCatch(this._obtenerDetallePorId.bind(this), undefined, "Error al buscar detalle por ID.");
    obtenerDetallesPorPedido = withTryCatch(this._obtenerDetallesPorPedido.bind(this), [], "Error al buscar detalles por pedido.");
    guardarDetalle = withTryCatchThrow(this._guardarDetalle.bind(this), "Error al guardar el detalle.");
    actualizarDetalle = withTryCatchThrow(this._actualizarDetalle.bind(this), "Error al actualizar el detalle.");
    eliminarDetalle = withTryCatchThrow(this._eliminarDetalle.bind(this), "Error al eliminar el detalle.");
}