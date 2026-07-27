import { ProveedorRepository } from "../data/proveedorRepository";
import { Proveedor } from "../models/Proveedor";
import { proveedorSchema, proveedorUpdateSchema } from "../validations/proveedorValidator";
import { validate } from "../validations/validate";
import { NotFoundError } from "../errors/NotFoundError";
import { ConflictError } from "../errors/ConflictError";

export class ProveedorService {

    private repository = new ProveedorRepository();

    async obtenerProveedores(): Promise<Proveedor[]> {
        return await this.repository.obtenerProveedores();
    }

    async obtenerProveedorPorId(id: number): Promise<Proveedor | undefined> {
        return await this.repository.obtenerProveedorPorId(id);
    }

    async guardarProveedor(proveedor: unknown): Promise<Proveedor> {
        const datosValidados = validate(proveedorSchema, proveedor);
        
        const correoExiste = await this.repository.obtenerProveedorPorCorreo(datosValidados.correoProveedor);
        if (correoExiste) {
            throw new ConflictError("El correo ya está registrado.");
        }
        
        return await this.repository.guardarProveedor(datosValidados);
    }

    async actualizarProveedor(proveedor: unknown): Promise<void> {
        const datosValidados = validate(proveedorUpdateSchema, proveedor);

        const existente = await this.repository.obtenerProveedorPorId(datosValidados.idProveedor);
        if (!existente) {
            throw new NotFoundError("El proveedor no existe.");
        }

        const proveedorCompleto: Proveedor = { ...existente, ...datosValidados };

        const actualizado = await this.repository.actualizarProveedor(proveedorCompleto);
        if (!actualizado) {
            throw new NotFoundError("El proveedor no existe.");
        }
    }

    async eliminarProveedor(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarProveedor(id);

        if (!eliminado) {
            throw new NotFoundError("El proveedor no existe.");
        }
    }
}