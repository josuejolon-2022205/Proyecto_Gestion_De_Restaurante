import { PedidoRepository } from "../data/pedidoRepository";
import { Pedido } from "../models/Pedido";
import { pedidoSchema, pedidoUpdateSchema } from "../validations/pedidoValidator";
import { validate } from "../validations/validate";
import { NotFoundError } from "../errors/NotFoundError";

export class PedidoService {

    private repository = new PedidoRepository();

    async obtenerPedidos(): Promise<Pedido[]> {
        return await this.repository.obtenerPedidos();
    }

    async obtenerPedidoPorId(id: number): Promise<Pedido | undefined> {
        return await this.repository.obtenerPedidoPorId(id);
    }

    async guardarPedido(pedido: unknown): Promise<Pedido> {
        const datosValidados = validate(pedidoSchema, pedido);
        return await this.repository.guardarPedido(datosValidados);
    }

    async actualizarPedido(pedido: unknown): Promise<void> {
        const datosValidados = validate(pedidoUpdateSchema, pedido);
        const actualizado = await this.repository.actualizarPedido(datosValidados as Pedido);

        if (!actualizado) {
            throw new NotFoundError("El pedido no existe.");
        }
    }

    async eliminarPedido(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarPedido(id);

        if (!eliminado) {
            throw new NotFoundError("El pedido no existe.");
        }
    }
}