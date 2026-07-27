import { ProductoRepository } from "../data/productoRepository";
import { Producto } from "../models/Producto";
import { productoSchema, productoUpdateSchema } from "../validations/productoValidator";
import { validate } from "../validations/validate";
import { NotFoundError } from "../errors/NotFoundError";

export class ProductoService {

    private repository = new ProductoRepository();

    async obtenerProductos(): Promise<Producto[]> {
        return await this.repository.obtenerProductos();
    }

    async obtenerProductoPorId(id: number): Promise<Producto | undefined> {
        return await this.repository.obtenerProductoPorId(id);
    }

    async guardarProducto(producto: unknown): Promise<Producto> {
        const datosValidados = validate(productoSchema, producto);
        return await this.repository.guardarProducto(datosValidados);
    }

    async actualizarProducto(producto: unknown): Promise<void> {
        const datosValidados = validate(productoUpdateSchema, producto);

        const existente = await this.repository.obtenerProductoPorId(datosValidados.idProducto);
        if (!existente) {
            throw new NotFoundError("El producto no existe.");
        }

        const productoCompleto: Producto = { ...existente, ...datosValidados };

        const actualizado = await this.repository.actualizarProducto(productoCompleto);
        if (!actualizado) {
            throw new NotFoundError("El producto no existe.");
        }
    }

    async eliminarProducto(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarProducto(id);

        if (!eliminado) {
            throw new NotFoundError("El producto no existe.");
        }
    }
}