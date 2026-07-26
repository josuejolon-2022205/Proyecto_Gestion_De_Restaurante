import { DetallePedidoRepository } from "../data/detallePedidoRepository";
import { DetallePedido } from "../models/DetallePedido";

export class DetallePedidoService {

    private repository = new DetallePedidoRepository();

    async obtenerDetalles(): Promise<DetallePedido[]> {
        return await this.repository.obtenerDetalles();
    }

    async obtenerDetallePorId(id: number): Promise<DetallePedido | undefined> {
        return await this.repository.obtenerDetallePorId(id);
    }

    async obtenerDetallesPorPedido(idPedido: number): Promise<DetallePedido[]> {
        return await this.repository.obtenerDetallesPorPedido(idPedido);
    }

    async guardarDetalle(detalle: Omit<DetallePedido, "idDetallePedido">): Promise<DetallePedido> {
        return await this.repository.guardarDetalle(detalle);
    }

    async actualizarDetalle(detalle: DetallePedido): Promise<void> {
        const actualizado = await this.repository.actualizarDetalle(detalle);

        if (!actualizado) {
            throw new Error("El detalle no existe.");
        }
    }

    async eliminarDetalle(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarDetalle(id);

        if (!eliminado) {
            throw new Error("El detalle no existe.");
        }
    }
}