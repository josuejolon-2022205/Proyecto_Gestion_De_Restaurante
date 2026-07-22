import { RolRepository } from "../data/RolRepository";
import { Rol } from "../models/Rol";

export class RolService {

    private repository = new RolRepository();

    async obtenerRoles(): Promise<Rol[]> {
        return await this.repository.obtenerRoles();
    }

    async obtenerRolPorId(id: number): Promise<Rol | undefined> {
        return await this.repository.obtenerRolPorId(id);
    }

    async guardarRol(rol: Rol): Promise<void> {
        const existe = await this.repository.obtenerRolPorId(rol.id_rol);

        if (existe) {
            throw new Error("El ID de rol ya existe.");
        }

        await this.repository.guardarRol(rol);
    }

    async actualizarRol(rol: Rol): Promise<void> {
        const actualizado = await this.repository.actualizarRol(rol);

        if (!actualizado) {
            throw new Error("El rol no existe.");
        }
    }

    async eliminarRol(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarRol(id);

        if (!eliminado) {
            throw new Error("El rol no existe.");
        }
    }
}