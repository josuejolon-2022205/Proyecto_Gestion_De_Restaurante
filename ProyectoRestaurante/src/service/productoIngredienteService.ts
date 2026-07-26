import { ProductoIngredienteRepository } from "../data/productoIngredienteRepository";
import { ProductoIngrediente } from "../models/productoIngrediente";

export class ProductoIngredienteService {

    private repository = new ProductoIngredienteRepository();

    async obtenerProductoIngredientes(): Promise<ProductoIngrediente[]> {
        return await this.repository.obtenerProductoIngredientes();
    }

    async obtenerProductoIngredientePorId(id: number): Promise<ProductoIngrediente | undefined> {
        return await this.repository.obtenerProductoIngredientePorId(id);
    }

    async obtenerIngredientesPorProducto(idProducto: number): Promise<ProductoIngrediente[]> {
        return await this.repository.obtenerIngredientesPorProducto(idProducto);
    }

    async obtenerProductosPorIngrediente(idIngrediente: number): Promise<ProductoIngrediente[]> {
        return await this.repository.obtenerProductosPorIngrediente(idIngrediente);
    }

    async guardarProductoIngrediente(pi: Omit<ProductoIngrediente, "idProductoIngrediente">): Promise<ProductoIngrediente> {
        return await this.repository.guardarProductoIngrediente(pi);
    }

    async actualizarProductoIngrediente(productoIngrediente: ProductoIngrediente): Promise<void> {
        const actualizado = await this.repository.actualizarProductoIngrediente(productoIngrediente);

        if (!actualizado) {
            throw new Error("El producto ingrediente no existe.");
        }
    }

    async eliminarProductoIngrediente(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarProductoIngrediente(id);

        if (!eliminado) {
            throw new Error("El producto ingrediente no existe.");
        }
    }
}