import { Cargo } from "../models/Cargo";
import { withTryCatch, withTryCatchThrow } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class CargoRepository {

    private async _obtenerCargos(): Promise<Cargo[]> {
        const result = await conexion.query('select "idCargo", "nombreCargo", "descripcionCargo" from cargo');
        return result.rows;
    }

    private async _obtenerCargoPorId(id: number): Promise<Cargo | undefined> {
        const result = await conexion.query(
            'select "idCargo", "nombreCargo", "descripcionCargo" from cargo where "idCargo" = $1',
            [id]
        );
        return result.rows[0];
    }

    private async _obtenerCargoPorNombre(nombre: string): Promise<Cargo | undefined> {
        const result = await conexion.query(
            'select "idCargo", "nombreCargo", "descripcionCargo" from cargo where "nombreCargo" = $1',
            [nombre]
        );
        return result.rows[0];
    }

    private async _guardarCargo(cargo: Omit<Cargo, "idCargo">): Promise<Cargo> {
        const result = await conexion.query(
            'insert into cargo ("nombreCargo", "descripcionCargo") values ($1, $2) returning "idCargo"',
            [cargo.nombreCargo, cargo.descripcionCargo]
        );
        if (!result.rows[0]) throw new Error("No se pudo obtener el id del cargo insertado");
        return { ...cargo, idCargo: result.rows[0].idCargo };
    }

    private async _actualizarCargo(cargoActualizado: Cargo): Promise<boolean> {
        const result = await conexion.query(
            'update cargo set "nombreCargo" = $1, "descripcionCargo" = $2 where "idCargo" = $3',
            [cargoActualizado.nombreCargo, cargoActualizado.descripcionCargo, cargoActualizado.idCargo]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarCargo(id: number): Promise<boolean> {
        const result = await conexion.query(
            'delete from cargo where "idCargo" = $1',
            [id]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerCargos = withTryCatch(this._obtenerCargos.bind(this), [], "Error al obtener cargos.");
    obtenerCargoPorId = withTryCatch(this._obtenerCargoPorId.bind(this), undefined, "Error al buscar cargo por ID.");
    obtenerCargoPorNombre = withTryCatch(this._obtenerCargoPorNombre.bind(this), undefined, "Error al buscar cargo por nombre.");

    guardarCargo = withTryCatchThrow(this._guardarCargo.bind(this), "Error al guardar el cargo.");
    actualizarCargo = withTryCatchThrow(this._actualizarCargo.bind(this), "Error al actualizar el cargo.");
    eliminarCargo = withTryCatchThrow(this._eliminarCargo.bind(this), "Error al eliminar el cargo.");
}