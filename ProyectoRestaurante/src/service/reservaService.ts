import { ReservaRepository } from "../data/reservaRepository";
import { Reserva } from "../models/Reserva";

export class ReservaService {

    private repository = new ReservaRepository();

    async obtenerReservas(): Promise<Reserva[]> {
        return await this.repository.obtenerReservas();
    }

    async obtenerReservaPorId(id: number): Promise<Reserva | undefined> {
        return await this.repository.obtenerReservaPorId(id);
    }

    async obtenerReservasPorCliente(idCliente: number): Promise<Reserva[]> {
        return await this.repository.obtenerReservasPorCliente(idCliente);
    }

    async obtenerReservasPorMesa(idMesa: number): Promise<Reserva[]> {
        return await this.repository.obtenerReservasPorMesa(idMesa);
    }

    async guardarReserva(reserva: Reserva): Promise<void> {
        const existe = await this.repository.obtenerReservaPorId(reserva.idReserva);

        if (existe) {
            throw new Error("El ID de reserva ya existe.");
        }

        await this.repository.guardarReserva(reserva);
    }

    async actualizarReserva(reserva: Reserva): Promise<void> {
        const actualizado = await this.repository.actualizarReserva(reserva);

        if (!actualizado) {
            throw new Error("La reserva no existe.");
        }
    }

    async eliminarReserva(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarReserva(id);

        if (!eliminado) {
            throw new Error("La reserva no existe.");
        }
    }
}