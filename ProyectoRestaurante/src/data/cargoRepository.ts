import { Cargo } from "../models/Cargo";
import { withTryCatch } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class CargoRepository {

    private async _obtenerCargos(): Promise<Cargo[]> {
        const result = await conexion.query("SELECT * FROM cargo");
        return result.rows;
    }

    private async _obtenerCargoPorId(id: number): Promise<Cargo | undefined> {
        const result = await conexion.query("SELECT * FROM cargo WHERE idCargo = $1", [id]);
        return result.rows[0];
    }

    private async _obtenerCargoPorNombre(nombre: string): Promise<Cargo | undefined> {
        const result = await conexion.query("SELECT * FROM cargo WHERE nombreCargo = $1", [nombre]);
        return result.rows[0];
    }

    private async _guardarCargo(cargo: Cargo): Promise<void> {
        await conexion.query(
            "INSERT INTO cargo (idCargo, nombreCargo, descripcionCargo) VALUES ($1, $2, $3)",
            [cargo.idCargo, cargo.nombreCargo, cargo.descripcionCargo]
        );
    }

    private async _actualizarCargo(cargoActualizado: Cargo): Promise<boolean> {
        const result = await conexion.query(
            "UPDATE cargo SET nombreCargo = $1, descripcionCargo = $2 WHERE idCargo = $3",
            [cargoActualizado.nombreCargo, cargoActualizado.descripcionCargo, cargoActualizado.idCargo]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarCargo(id: number): Promise<boolean> {
        const result = await conexion.query("DELETE FROM cargo WHERE idCargo = $1", [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerCargos = withTryCatch(this._obtenerCargos.bind(this), [], "Error al obtener cargos.");
    obtenerCargoPorId = withTryCatch(this._obtenerCargoPorId.bind(this), undefined, "Error al buscar cargo por ID.");
    obtenerCargoPorNombre = withTryCatch(this._obtenerCargoPorNombre.bind(this), undefined, "Error al buscar cargo por nombre.");
    guardarCargo = withTryCatch(this._guardarCargo.bind(this), undefined, "Error al guardar el cargo.");
    actualizarCargo = withTryCatch(this._actualizarCargo.bind(this), false, "Error al actualizar el cargo.");
    eliminarCargo = withTryCatch(this._eliminarCargo.bind(this), false, "Error al eliminar el cargo.");
}