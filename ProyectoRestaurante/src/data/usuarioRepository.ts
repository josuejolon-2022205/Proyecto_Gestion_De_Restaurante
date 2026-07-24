import { Usuario } from "../models/Usuario";
import { withTryCatch } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class UsuarioRepository {

    private async _obtenerUsuarios(): Promise<Usuario[]> {
        const result = await conexion.query("select * from usuario");
        return result.rows;
    }

    private async _obtenerUsuarioPorId(id: number): Promise<Usuario | undefined> {
        const result = await conexion.query("select * from usuario where idUsuario = $1", [id]);
        return result.rows[0];
    }

    private async _obtenerUsuarioPorCorreo(correo: string): Promise<Usuario | undefined> {
        const result = await conexion.query("select * from usuario where correo = $1", [correo]);
        return result.rows[0];
    }

    private async _guardarUsuario(usuario: Usuario): Promise<void> {
        await conexion.query(
            "insert into usuario (idUsuario, nombreUsuario, correo, contrasena, estado, fkIdRol) values ($1, $2, $3, $4, $5, $6)",
            [usuario.idUsuario, usuario.nombreUsuario, usuario.correo, usuario.contrasena, usuario.estado, usuario.fkIdRol]
        );
    }

    private async _actualizarUsuario(usuarioActualizado: Usuario): Promise<boolean> {
        const result = await conexion.query(
            "update usuario set nombreUsuario = $1, correo = $2, contrasena = $3, estado = $4, fkIdRol = $5 where idUsuario = $6",
            [usuarioActualizado.nombreUsuario, usuarioActualizado.correo, usuarioActualizado.contrasena, usuarioActualizado.estado, usuarioActualizado.fkIdRol, usuarioActualizado.idUsuario]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarUsuario(id: number): Promise<boolean> {
        const result = await conexion.query("delete from usuario where idUsuario = $1", [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerUsuarios = withTryCatch(this._obtenerUsuarios.bind(this), [], "Error al obtener usuarios.");
    obtenerUsuarioPorId = withTryCatch(this._obtenerUsuarioPorId.bind(this), undefined, "Error al buscar usuario por ID.");
    obtenerUsuarioPorCorreo = withTryCatch(this._obtenerUsuarioPorCorreo.bind(this), undefined, "Error al buscar usuario por correo.");
    guardarUsuario = withTryCatch(this._guardarUsuario.bind(this), undefined, "Error al guardar el usuario.");
    actualizarUsuario = withTryCatch(this._actualizarUsuario.bind(this), false, "Error al actualizar el usuario.");
    eliminarUsuario = withTryCatch(this._eliminarUsuario.bind(this), false, "Error al eliminar el usuario.");
}