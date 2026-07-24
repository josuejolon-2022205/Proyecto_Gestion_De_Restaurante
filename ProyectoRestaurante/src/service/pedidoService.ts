import { PedidoRepository } from "../data/pedidoRepository";
import { Pedido } from "../models/Pedido";

export class PedidoService {

    private repository = new PedidoRepository();

    async obtenerPedidos(): Promise<Pedido[]> {
        return await this.repository.obtenerPedidos();
    }

    async obtenerPedidoPorId(id: number): Promise<Pedido | undefined> {
        return await this.repository.obtenerPedidoPorId(id);
    }

    async obtenerPedidosPorCliente(idCliente: number): Promise<Pedido[]> {
        return await this.repository.obtenerPedidosPorCliente(idCliente);
    }

    async obtenerPedidosPorMesa(idMesa: number): Promise<Pedido[]> {
        return await this.repository.obtenerPedidosPorMesa(idMesa);
    }

    async guardarPedido(pedido: Pedido): Promise<void> {
        const existe = await this.repository.obtenerPedidoPorId(pedido.idPedido);

        if (existe) {
            throw new Error("El ID de pedido ya existe.");
        }

        await this.repository.guardarPedido(pedido);
    }

    async actualizarPedido(pedido: Pedido): Promise<void> {
        const actualizado = await this.repository.actualizarPedido(pedido);

        if (!actualizado) {
            throw new Error("El pedido no existe.");
        }
    }

    async eliminarPedido(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarPedido(id);

        if (!eliminado) {
            throw new Error("El pedido no existe.");
        }
    }
}