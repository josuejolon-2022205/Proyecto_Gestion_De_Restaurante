import { UsuarioRepository } from "../data/usuarioRepository";
import { Usuario } from "../models/Usuario";

export class UsuarioService {

    private repository = new UsuarioRepository();

    async obtenerUsuarios(): Promise<Usuario[]> {
        return await this.repository.obtenerUsuarios();
    }

    async obtenerUsuarioPorId(id: number): Promise<Usuario | undefined> {
        return await this.repository.obtenerUsuarioPorId(id);
    }

    async guardarUsuario(usuario: Omit<Usuario, "idUsuario">): Promise<Usuario> {
        const correoExiste = await this.repository.obtenerUsuarioPorCorreo(usuario.correo);
        if (correoExiste) {
            throw new Error("El correo ya está registrado.");
        }
        return await this.repository.guardarUsuario(usuario);
    }
    async actualizarUsuario(usuario: Usuario): Promise<void> {
        const actualizado = await this.repository.actualizarUsuario(usuario);

        if (!actualizado) {
            throw new Error("El usuario no existe.");
        }
    }

    async eliminarUsuario(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarUsuario(id);

        if (!eliminado) {
            throw new Error("El usuario no existe.");
        }
    }
}