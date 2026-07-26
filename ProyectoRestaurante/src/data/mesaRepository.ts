import { Mesa } from "../models/Mesa";
import { withTryCatch, withTryCatchThrow } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class MesaRepository {

    private async _obtenerMesas(): Promise<Mesa[]> {
        const result = await conexion.query('select * from "mesa"');
        return result.rows;
    }

    private async _obtenerMesaPorId(id: number): Promise<Mesa | undefined> {
        const result = await conexion.query('select * from "mesa" where "idMesa" = $1', [id]);
        return result.rows[0];
    }

    private async _obtenerMesaPorNumero(numero: number): Promise<Mesa | undefined> {
        const result = await conexion.query('select * from "mesa" where "numeroMesa" = $1', [numero]);
        return result.rows[0];
    }

    private async _guardarMesa(mesa: Omit<Mesa, "idMesa">): Promise<Mesa> {
        const result = await conexion.query(
            'insert into "mesa" ("estadoMesa", "numeroMesa", "capacidad") values ($1, $2, $3) returning "idMesa"',
            [mesa.estadoMesa, mesa.numeroMesa, mesa.capacidad]
        );
        if (!result.rows[0]) throw new Error("No se pudo obtener el id de la mesa insertada");
        return { ...mesa, idMesa: result.rows[0].idMesa };
    }

    private async _actualizarMesa(mesaActualizada: Mesa): Promise<boolean> {
        const result = await conexion.query(
            'update "mesa" set "estadoMesa" = $1, "numeroMesa" = $2, "capacidad" = $3 where "idMesa" = $4',
            [mesaActualizada.estadoMesa, mesaActualizada.numeroMesa, mesaActualizada.capacidad, mesaActualizada.idMesa]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarMesa(id: number): Promise<boolean> {
        const result = await conexion.query('delete from "mesa" where "idMesa" = $1', [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerMesas = withTryCatch(this._obtenerMesas.bind(this), [], "Error al obtener mesas.");
    obtenerMesaPorId = withTryCatch(this._obtenerMesaPorId.bind(this), undefined, "Error al buscar mesa por ID.");
    obtenerMesaPorNumero = withTryCatch(this._obtenerMesaPorNumero.bind(this), undefined, "Error al buscar mesa por número.");
    guardarMesa = withTryCatchThrow(this._guardarMesa.bind(this), "Error al guardar la mesa.");
    actualizarMesa = withTryCatchThrow(this._actualizarMesa.bind(this), "Error al actualizar la mesa.");
    eliminarMesa = withTryCatchThrow(this._eliminarMesa.bind(this), "Error al eliminar la mesa.");
}