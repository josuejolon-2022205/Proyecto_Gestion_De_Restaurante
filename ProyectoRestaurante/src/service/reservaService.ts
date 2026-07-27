import { ReservaRepository } from "../data/reservaRepository";
import { Reserva } from "../models/Reserva";
import { reservaSchema, reservaUpdateSchema } from "../validations/reservaValidator";
import { validate } from "../validations/validate";
import { NotFoundError } from "../errors/NotFoundError";

export class ReservaService {

    private repository = new ReservaRepository();

    async obtenerReservas(): Promise<Reserva[]> {
        return await this.repository.obtenerReservas();
    }

    async obtenerReservaPorId(id: number): Promise<Reserva | undefined> {
        return await this.repository.obtenerReservaPorId(id);
    }

    async guardarReserva(reserva: unknown): Promise<Reserva> {
        const datosValidados = validate(reservaSchema, reserva);
        return await this.repository.guardarReserva(datosValidados);
    }

    async actualizarReserva(reserva: unknown): Promise<void> {
        const datosValidados = validate(reservaUpdateSchema, reserva);

        const existente = await this.repository.obtenerReservaPorId(datosValidados.idReserva);
        if (!existente) {
            throw new NotFoundError("La reserva no existe.");
        }

        const reservaCompleta: Reserva = { ...existente, ...datosValidados };

        const actualizado = await this.repository.actualizarReserva(reservaCompleta);
        if (!actualizado) {
            throw new NotFoundError("La reserva no existe.");
        }
    }

    async eliminarReserva(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarReserva(id);

        if (!eliminado) {
            throw new NotFoundError("La reserva no existe.");
        }
    }
}