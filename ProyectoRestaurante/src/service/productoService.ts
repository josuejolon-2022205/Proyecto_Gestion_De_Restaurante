import { ProductoRepository } from "../data/productoRepository";
import { Producto } from "../models/Producto";

export class ProductoService {

    private repository = new ProductoRepository();

    async obtenerProductos(): Promise<Producto[]> {
        return await this.repository.obtenerProductos();
    }

    async obtenerProductoPorId(id: number): Promise<Producto | undefined> {
        return await this.repository.obtenerProductoPorId(id);
    }

    async obtenerProductosPorCategoria(idCategoria: number): Promise<Producto[]> {
        return await this.repository.obtenerProductosPorCategoria(idCategoria);
    }

    async guardarProducto(producto: Producto): Promise<void> {
        const existe = await this.repository.obtenerProductoPorId(producto.idProducto);

        if (existe) {
            throw new Error("El ID de producto ya existe.");
        }

        await this.repository.guardarProducto(producto);
    }

    async actualizarProducto(producto: Producto): Promise<void> {
        const actualizado = await this.repository.actualizarProducto(producto);

        if (!actualizado) {
            throw new Error("El producto no existe.");
        }
    }

    async eliminarProducto(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarProducto(id);

        if (!eliminado) {
            throw new Error("El producto no existe.");
        }
    }
}