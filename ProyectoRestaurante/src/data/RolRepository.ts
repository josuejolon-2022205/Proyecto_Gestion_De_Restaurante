import { Rol } from "../models/Rol";
import { Roles } from "../enums/Roles";
import { withTryCatch, withTryCatchThrow } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class RolRepository {

    private async _obtenerRoles(): Promise<Rol[]> {
        const result = await conexion.query('select * from "rol"');
        return result.rows;
    }

    private async _obtenerRolPorId(id: number): Promise<Rol | undefined> {
        const result = await conexion.query('select * from "rol" where "idRol" = $1', [id]);
        return result.rows[0];
    }

    private async _obtenerRolPorNombre(nombre: string): Promise<Rol | undefined> {
        const result = await conexion.query('select * from "rol" where "nombre" = $1', [nombre]);
        return result.rows[0];
    }

    private async _guardarRol(rol: Omit<Rol, "idRol">): Promise<Rol> {
        const result = await conexion.query(
            'insert into "rol" ("nombre", "descripcion", "roles") values ($1, $2, $3) returning "idRol"',
            [rol.nombre, rol.descripcion, rol.roles]
        );
        if (!result.rows[0]) {
            throw new Error("No se pudo obtener el id del rol insertado");
        }
        return { ...rol, idRol: result.rows[0].idRol };
    }

    private async _actualizarRol(rolActualizado: Rol): Promise<boolean> {
        const result = await conexion.query(
            'update "rol" set "nombre" = $1, "descripcion" = $2, "roles" = $3 where "idRol" = $4',
            [rolActualizado.nombre, rolActualizado.descripcion, rolActualizado.roles, rolActualizado.idRol]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarRol(id: number): Promise<boolean> {
        const result = await conexion.query('delete from "rol" where "idRol" = $1', [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerRoles = withTryCatch(this._obtenerRoles.bind(this), [], "Error al obtener roles.");
    obtenerRolPorId = withTryCatch(this._obtenerRolPorId.bind(this), undefined, "Error al buscar rol por ID.");
    obtenerRolPorNombre = withTryCatch(this._obtenerRolPorNombre.bind(this), undefined, "Error al buscar rol por nombre.");

    guardarRol = withTryCatchThrow(this._guardarRol.bind(this), "Error al guardar el rol.");
    actualizarRol = withTryCatchThrow(this._actualizarRol.bind(this), "Error al actualizar el rol.");
    eliminarRol = withTryCatchThrow(this._eliminarRol.bind(this), "Error al eliminar el rol.");
}