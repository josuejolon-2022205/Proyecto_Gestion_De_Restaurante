import { cargo } from "../models/Cargo";
import { withTryCatch } from "../utils/withTryCatch";

export class CargoRepository {

    private db: cargo[] = [];

    private async _obtenerCargos(): Promise<cargo[]> {
        return this.db;
    }

    private async _obtenerCargoPorId(id: number): Promise<cargo | undefined> {
        return this.db.find(c => c.id_cargo === id);
    }

    private async _guardarCargo(cargo: cargo): Promise<void> {
        this.db.push(cargo);
    }

    private async _actualizarCargo(cargoActualizado: cargo): Promise<boolean> {
        const indice = this.db.findIndex(c => c.id_cargo === cargoActualizado.id_cargo);

        if (indice === -1) return false;

        this.db[indice] = cargoActualizado;
        return true;
    }

    private async _eliminarCargo(id: number): Promise<boolean> {
        const nuevosCargos = this.db.filter(c => c.id_cargo !== id);

        if (this.db.length === nuevosCargos.length) return false;

        this.db = nuevosCargos;
        return true;
    }

    obtenerCargos = withTryCatch(
        this._obtenerCargos.bind(this),
        [],
        "Error al obtener cargos."
    );

    obtenerCargoPorId = withTryCatch(
        this._obtenerCargoPorId.bind(this),
        undefined,
        "Error al buscar cargo por ID."
    );

    guardarCargo = withTryCatch(
        this._guardarCargo.bind(this),
        undefined,
        "Error al guardar el cargo."
    );

    actualizarCargo = withTryCatch(
        this._actualizarCargo.bind(this),
        false,
        "Error al actualizar el cargo."
    );

    eliminarCargo = withTryCatch(
        this._eliminarCargo.bind(this),
        false,
        "Error al eliminar el cargo."
    );
}