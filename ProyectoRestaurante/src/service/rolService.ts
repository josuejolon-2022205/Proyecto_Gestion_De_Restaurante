import { RolRepository } from "../data/RolRepository";
import { Rol } from "../models/Rol";
import { rolSchema, rolUpdateSchema } from "../validations/rolValidator";
import { validate } from "../validations/validate";
import { NotFoundError } from "../errors/NotFoundError";

export class RolService {

    private repository = new RolRepository();

    async obtenerRoles(): Promise<Rol[]> {
        return await this.repository.obtenerRoles();
    }

    async obtenerRolPorId(id: number): Promise<Rol | undefined> {
        return await this.repository.obtenerRolPorId(id);
    }

    async guardarRol(rol: unknown): Promise<Rol> {
        const datosValidados = validate(rolSchema, rol);
        return await this.repository.guardarRol(datosValidados);
    }

    async actualizarRol(rol: unknown): Promise<void> {
        const datosValidados = validate(rolUpdateSchema, rol);
        const actualizado = await this.repository.actualizarRol(datosValidados as Rol);

        if (!actualizado) {
            throw new NotFoundError("El rol no existe.");
        }
    }

    async eliminarRol(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarRol(id);

        if (!eliminado) {
            throw new NotFoundError("El rol no existe.");
        }
    }
}