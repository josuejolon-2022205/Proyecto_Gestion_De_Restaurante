import { Rol } from "../models/Rol";
import { withTryCatch } from "../utils/withTryCatch";
import { conexion } from "../config/database";
import { Roles } from "../enums/Roles";

export class RolRepository {

    private async _obtenerRoles(): Promise<Rol[]> {
        const result = await conexion.query("SELECT * FROM rol");
        return result.rows;
    }

    private async _obtenerRolPorId(id: number): Promise<Rol | undefined> {
        const result = await conexion.query("SELECT * FROM rol WHERE idRol = $1", [id]);
        return result.rows[0];
    }

    private async _obtenerRolPorNombre(nombre: string): Promise<Rol | undefined> {
        const result = await conexion.query("SELECT * FROM rol WHERE nombre = $1", [nombre]);
        return result.rows[0];
    }

    private async _guardarRol(rol: Rol): Promise<void> {
        await conexion.query(
            "INSERT INTO rol (idRol, nombre, descripcion, roles) VALUES ($1, $2, $3, $4)",
            [rol.idRol, rol.nombre, rol.descripcion, rol.idRol === 1 ? Roles.ADMIN : Roles.USER]
        );
    }

    private async _actualizarRol(rolActualizado: Rol): Promise<boolean> {
        const result = await conexion.query(
            "UPDATE rol SET nombre = $1, descripcion = $2, roles = $3 WHERE idRol = $4",
            [rolActualizado.nombre, rolActualizado.descripcion, rolActualizado.idRol === 1 ? Roles.ADMIN : Roles.USER, rolActualizado.idRol]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarRol(id: number): Promise<boolean> {
        const result = await conexion.query("DELETE FROM rol WHERE idRol = $1", [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerRoles = withTryCatch(this._obtenerRoles.bind(this), [], "Error al obtener roles.");
    obtenerRolPorId = withTryCatch(this._obtenerRolPorId.bind(this), undefined, "Error al buscar rol por ID.");
    obtenerRolPorNombre = withTryCatch(this._obtenerRolPorNombre.bind(this), undefined, "Error al buscar rol por nombre.");
    guardarRol = withTryCatch(this._guardarRol.bind(this), undefined, "Error al guardar el rol.");
    actualizarRol = withTryCatch(this._actualizarRol.bind(this), false, "Error al actualizar el rol.");
    eliminarRol = withTryCatch(this._eliminarRol.bind(this), false, "Error al eliminar el rol.");
}