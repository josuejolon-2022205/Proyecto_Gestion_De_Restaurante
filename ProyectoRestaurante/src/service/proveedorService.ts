import { ProveedorRepository } from "../data/proveedorRepository";
import { Proveedor } from "../models/Proveedor";

export class ProveedorService {

    private repository = new ProveedorRepository();

    async obtenerProveedores(): Promise<Proveedor[]> {
        return await this.repository.obtenerProveedores();
    }

    async obtenerProveedorPorId(id: number): Promise<Proveedor | undefined> {
        return await this.repository.obtenerProveedorPorId(id);
    }

    async guardarProveedor(proveedor: Omit<Proveedor, "idProveedor">): Promise<Proveedor> {
        const correoExiste = await this.repository.obtenerProveedorPorCorreo(proveedor.correoProveedor);
        if (correoExiste) {
            throw new Error("El correo ya está registrado.");
        }
        return await this.repository.guardarProveedor(proveedor);
    }
    async actualizarProveedor(proveedor: Proveedor): Promise<void> {
        const actualizado = await this.repository.actualizarProveedor(proveedor);

        if (!actualizado) {
            throw new Error("El proveedor no existe.");
        }
    }

    async eliminarProveedor(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarProveedor(id);

        if (!eliminado) {
            throw new Error("El proveedor no existe.");
        }
    }
}