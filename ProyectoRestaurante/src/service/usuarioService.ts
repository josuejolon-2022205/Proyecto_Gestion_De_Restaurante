import { UsuarioRepository } from "../data/usuarioRepository";
import { Usuario } from "../models/Usuario";
import { usuarioSchema, usuarioUpdateSchema } from "../validations/usuarioValidator";
import { validate } from "../validations/validate";
import { NotFoundError } from "../errors/NotFoundError";
import { ConflictError } from "../errors/ConflictError";

export class UsuarioService {

    private repository = new UsuarioRepository();

    async obtenerUsuarios(): Promise<Usuario[]> {
        return await this.repository.obtenerUsuarios();
    }

    async obtenerUsuarioPorId(id: number): Promise<Usuario | undefined> {
        return await this.repository.obtenerUsuarioPorId(id);
    }

    async guardarUsuario(usuario: unknown): Promise<Usuario> {
        const datosValidados = validate(usuarioSchema, usuario);
        
        const correoExiste = await this.repository.obtenerUsuarioPorCorreo(datosValidados.correo);
        if (correoExiste) {
            throw new ConflictError("El correo ya está registrado.");
        }
        
        return await this.repository.guardarUsuario(datosValidados);
    }

    async actualizarUsuario(usuario: unknown): Promise<void> {
        const datosValidados = validate(usuarioUpdateSchema, usuario);
        const actualizado = await this.repository.actualizarUsuario(datosValidados as Usuario);

        if (!actualizado) {
            throw new NotFoundError("El usuario no existe.");
        }
    }

    async eliminarUsuario(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarUsuario(id);

        if (!eliminado) {
            throw new NotFoundError("El usuario no existe.");
        }
    }
}