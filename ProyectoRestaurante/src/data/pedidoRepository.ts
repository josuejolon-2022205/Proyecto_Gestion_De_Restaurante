import { Pedido } from "../models/Pedido";
import { withTryCatch } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class PedidoRepository {

    private async _obtenerPedidos(): Promise<Pedido[]> {
        const result = await conexion.query("select * from pedido");
        return result.rows;
    }

    private async _obtenerPedidoPorId(id: number): Promise<Pedido | undefined> {
        const result = await conexion.query("select * from pedido where idPedido = $1", [id]);
        return result.rows[0];
    }

    private async _obtenerPedidosPorCliente(idCliente: number): Promise<Pedido[]> {
        const result = await conexion.query("select * from pedido where fkIdCliente = $1", [idCliente]);
        return result.rows;
    }

    private async _obtenerPedidosPorMesa(idMesa: number): Promise<Pedido[]> {
        const result = await conexion.query("select * from pedido where fkIdMesa = $1", [idMesa]);
        return result.rows;
    }

    private async _guardarPedido(pedido: Pedido): Promise<void> {
        await conexion.query(
            "insert into pedido (idPedido, fechaPedido, horaPedido, estadoPedido, total, fkIdCliente, fkIdMesa, fkIdEmpleado) values ($1, $2, $3, $4, $5, $6, $7, $8)",
            [pedido.idPedido, pedido.fechaPedido, pedido.horaPedido, pedido.estadoPedido, pedido.total, pedido.fkIdCliente, pedido.fkIdMesa, pedido.fkIdEmpleado]
        );
    }

    private async _actualizarPedido(pedidoActualizado: Pedido): Promise<boolean> {
        const result = await conexion.query(
            "update pedido set fechaPedido = $1, horaPedido = $2, estadoPedido = $3, total = $4, fkIdCliente = $5, fkIdMesa = $6, fkIdEmpleado = $7 where idPedido = $8",
            [pedidoActualizado.fechaPedido, pedidoActualizado.horaPedido, pedidoActualizado.estadoPedido, pedidoActualizado.total, pedidoActualizado.fkIdCliente, pedidoActualizado.fkIdMesa, pedidoActualizado.fkIdEmpleado, pedidoActualizado.idPedido]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarPedido(id: number): Promise<boolean> {
        const result = await conexion.query("delete from pedido where idPedido = $1", [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerPedidos = withTryCatch(this._obtenerPedidos.bind(this), [], "Error al obtener pedidos.");
    obtenerPedidoPorId = withTryCatch(this._obtenerPedidoPorId.bind(this), undefined, "Error al buscar pedido por ID.");
    obtenerPedidosPorCliente = withTryCatch(this._obtenerPedidosPorCliente.bind(this), [], "Error al buscar pedidos por cliente.");
    obtenerPedidosPorMesa = withTryCatch(this._obtenerPedidosPorMesa.bind(this), [], "Error al buscar pedidos por mesa.");
    guardarPedido = withTryCatch(this._guardarPedido.bind(this), undefined, "Error al guardar el pedido.");
    actualizarPedido = withTryCatch(this._actualizarPedido.bind(this), false, "Error al actualizar el pedido.");
    eliminarPedido = withTryCatch(this._eliminarPedido.bind(this), false, "Error al eliminar el pedido.");
}