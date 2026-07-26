import { Reserva } from "../models/Reserva";
import { withTryCatch, withTryCatchThrow } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class ReservaRepository {

    private async _obtenerReservas(): Promise<Reserva[]> {
        const result = await conexion.query('select * from "reserva"');
        return result.rows;
    }

    private async _obtenerReservaPorId(id: number): Promise<Reserva | undefined> {
        const result = await conexion.query('select * from "reserva" where "idReserva" = $1', [id]);
        return result.rows[0];
    }

    private async _obtenerReservasPorCliente(idCliente: number): Promise<Reserva[]> {
        const result = await conexion.query('select * from "reserva" where "fkIdCliente" = $1', [idCliente]);
        return result.rows;
    }

    private async _obtenerReservasPorMesa(idMesa: number): Promise<Reserva[]> {
        const result = await conexion.query('select * from "reserva" where "fkIdMesa" = $1', [idMesa]);
        return result.rows;
    }

    private async _guardarReserva(reserva: Omit<Reserva, "idReserva">): Promise<Reserva> {
        const result = await conexion.query(
            'insert into "reserva" ("fechaReserva", "horaReserva", "cantidadPersonas", "estado", "fkIdCliente", "fkIdMesa") values ($1, $2, $3, $4, $5, $6) returning "idReserva"',
            [reserva.fechaReserva, reserva.horaReserva, reserva.cantidadPersonas, reserva.estado, reserva.fkIdCliente, reserva.fkIdMesa]
        );
        if (!result.rows[0]) throw new Error("No se pudo obtener el id de la reserva insertada");
        return { ...reserva, idReserva: result.rows[0].idReserva };
    }

    private async _actualizarReserva(reservaActualizada: Reserva): Promise<boolean> {
        const result = await conexion.query(
            'update "reserva" set "fechaReserva" = $1, "horaReserva" = $2, "cantidadPersonas" = $3, "estado" = $4, "fkIdCliente" = $5, "fkIdMesa" = $6 where "idReserva" = $7',
            [reservaActualizada.fechaReserva, reservaActualizada.horaReserva, reservaActualizada.cantidadPersonas, reservaActualizada.estado, reservaActualizada.fkIdCliente, reservaActualizada.fkIdMesa, reservaActualizada.idReserva]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarReserva(id: number): Promise<boolean> {
        const result = await conexion.query('delete from "reserva" where "idReserva" = $1', [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerReservas = withTryCatch(this._obtenerReservas.bind(this), [], "Error al obtener reservas.");
    obtenerReservaPorId = withTryCatch(this._obtenerReservaPorId.bind(this), undefined, "Error al buscar reserva por ID.");
    obtenerReservasPorCliente = withTryCatch(this._obtenerReservasPorCliente.bind(this), [], "Error al buscar reservas por cliente.");
    obtenerReservasPorMesa = withTryCatch(this._obtenerReservasPorMesa.bind(this), [], "Error al buscar reservas por mesa.");
    guardarReserva = withTryCatchThrow(this._guardarReserva.bind(this), "Error al guardar la reserva.");
    actualizarReserva = withTryCatchThrow(this._actualizarReserva.bind(this), "Error al actualizar la reserva.");
    eliminarReserva = withTryCatchThrow(this._eliminarReserva.bind(this), "Error al eliminar la reserva.");
}