import { PagoRepository } from "../data/pagoRepository";
import { Pago } from "../models/Pago";

export class PagoService {

    private repository = new PagoRepository();

    async obtenerPagos(): Promise<Pago[]> {
        return await this.repository.obtenerPagos();
    }

    async obtenerPagoPorId(id: number): Promise<Pago | undefined> {
        return await this.repository.obtenerPagoPorId(id);
    }

    async obtenerPagosPorPedido(idPedido: number): Promise<Pago[]> {
        return await this.repository.obtenerPagosPorPedido(idPedido);
    }

    async guardarPago(pago: Omit<Pago, "idPago">): Promise<Pago> {
        return await this.repository.guardarPago(pago);
    }

    async actualizarPago(pago: Pago): Promise<void> {
        const actualizado = await this.repository.actualizarPago(pago);

        if (!actualizado) {
            throw new Error("El pago no existe.");
        }
    }

    async eliminarPago(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarPago(id);

        if (!eliminado) {
            throw new Error("El pago no existe.");
        }
    }
}