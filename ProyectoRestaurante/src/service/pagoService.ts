import { PagoRepository } from "../data/pagoRepository";
import { Pago } from "../models/Pago";
import { pagoSchema, pagoUpdateSchema } from "../validations/pagoValidator";
import { validate } from "../validations/validate";
import { NotFoundError } from "../errors/NotFoundError";

export class PagoService {

    private repository = new PagoRepository();

    async obtenerPagos(): Promise<Pago[]> {
        return await this.repository.obtenerPagos();
    }

    async obtenerPagoPorId(id: number): Promise<Pago | undefined> {
        return await this.repository.obtenerPagoPorId(id);
    }

    async guardarPago(pago: unknown): Promise<Pago> {
        const datosValidados = validate(pagoSchema, pago);
        return await this.repository.guardarPago(datosValidados);
    }

    async actualizarPago(pago: unknown): Promise<void> {
        const datosValidados = validate(pagoUpdateSchema, pago);
        const actualizado = await this.repository.actualizarPago(datosValidados as Pago);

        if (!actualizado) {
            throw new NotFoundError("El pago no existe.");
        }
    }

    async eliminarPago(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarPago(id);

        if (!eliminado) {
            throw new NotFoundError("El pago no existe.");
        }
    }
}