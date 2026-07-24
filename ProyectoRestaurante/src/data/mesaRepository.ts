import { Mesa } from "../models/Mesa";
import { withTryCatch } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class MesaRepository {

    private async _obtenerMesas(): Promise<Mesa[]> {
        const result = await conexion.query("select * from mesa");
        return result.rows;
    }

    private async _obtenerMesaPorId(id: number): Promise<Mesa | undefined> {
        const result = await conexion.query("select * from mesa where idMesa = $1", [id]);
        return result.rows[0];
    }

    private async _obtenerMesaPorNumero(numero: number): Promise<Mesa | undefined> {
        const result = await conexion.query("select * from mesa where numeroMesa = $1", [numero]);
        return result.rows[0];
    }

    private async _guardarMesa(mesa: Mesa): Promise<void> {
        await conexion.query(
            "insert into mesa (idMesa, estadoMesa, numeroMesa, capacidad) values ($1, $2, $3, $4)",
            [mesa.idMesa, mesa.estadoMesa, mesa.numeroMesa, mesa.capacidad]
        );
    }

    private async _actualizarMesa(mesaActualizada: Mesa): Promise<boolean> {
        const result = await conexion.query(
            "update mesa set estadoMesa = $1, numeroMesa = $2, capacidad = $3 where idMesa = $4",
            [mesaActualizada.estadoMesa, mesaActualizada.numeroMesa, mesaActualizada.capacidad, mesaActualizada.idMesa]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarMesa(id: number): Promise<boolean> {
        const result = await conexion.query("delete from mesa where idMesa = $1", [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerMesas = withTryCatch(this._obtenerMesas.bind(this), [], "Error al obtener mesas.");
    obtenerMesaPorId = withTryCatch(this._obtenerMesaPorId.bind(this), undefined, "Error al buscar mesa por ID.");
    obtenerMesaPorNumero = withTryCatch(this._obtenerMesaPorNumero.bind(this), undefined, "Error al buscar mesa por número.");
    guardarMesa = withTryCatch(this._guardarMesa.bind(this), undefined, "Error al guardar la mesa.");
    actualizarMesa = withTryCatch(this._actualizarMesa.bind(this), false, "Error al actualizar la mesa.");
    eliminarMesa = withTryCatch(this._eliminarMesa.bind(this), false, "Error al eliminar la mesa.");
}