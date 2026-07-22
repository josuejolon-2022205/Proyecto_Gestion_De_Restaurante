import { Rol } from "../models/Rol";
import { withTryCatch } from "../utils/withTryCatch";

export class RolRepository {

    private db: Rol[] = [];

    private async _obtenerRoles(): Promise<Rol[]> {
        return this.db;
    }

    private async _obtenerRolPorId(id: number): Promise<Rol | undefined> {
        return this.db.find(r => r.id_rol === id);
    }

    private async _obtenerRolPorNombre(nombre: string): Promise<Rol | undefined> {
        return this.db.find(r => r.nombre === nombre);
    }

    private async _guardarRol(rol: Rol): Promise<void> {
        this.db.push(rol);
    }

    private async _actualizarRol(rolActualizado: Rol): Promise<boolean> {
        const indice = this.db.findIndex(r => r.id_rol === rolActualizado.id_rol);

        if (indice === -1) return false;

        this.db[indice] = rolActualizado;
        return true;
    }

    private async _eliminarRol(id: number): Promise<boolean> {
        const nuevosRoles = this.db.filter(r => r.id_rol !== id);

        if (this.db.length === nuevosRoles.length) return false;

        this.db = nuevosRoles;
        return true;
    }


    obtenerRoles = withTryCatch(
        this._obtenerRoles.bind(this),
        [],
        "Error al obtener roles."
    );

    obtenerRolPorId = withTryCatch(
        this._obtenerRolPorId.bind(this),
        undefined,
        "Error al buscar rol por ID."
    );

    obtenerRolPorNombre = withTryCatch(
        this._obtenerRolPorNombre.bind(this),
        undefined,
        "Error al buscar rol por nombre."
    );

    guardarRol = withTryCatch(
        this._guardarRol.bind(this),
        undefined,
        "Error al guardar el rol."
    );

    actualizarRol = withTryCatch(
        this._actualizarRol.bind(this),
        false,
        "Error al actualizar el rol."
    );

    eliminarRol = withTryCatch(
        this._eliminarRol.bind(this),
        false,
        "Error al eliminar el rol."
    );
}