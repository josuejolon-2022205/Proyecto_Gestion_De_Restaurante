import { CategoriaProductoRepository } from "../data/categoriaProductoRepository";
import { CategoriaProducto } from "../models/CategoriaProducto";

export class CategoriaProductoService {

    private repository = new CategoriaProductoRepository();

    async obtenerCategorias(): Promise<CategoriaProducto[]> {
        return await this.repository.obtenerCategorias();
    }

    async obtenerCategoriaPorId(id: number): Promise<CategoriaProducto | undefined> {
        return await this.repository.obtenerCategoriaPorId(id);
    }

    async guardarCategoria(categoria: CategoriaProducto): Promise<void> {
        const existe = await this.repository.obtenerCategoriaPorId(categoria.idCategoriaProducto);

        if (existe) {
            throw new Error("El ID de categoría ya existe.");
        }

        await this.repository.guardarCategoria(categoria);
    }

    async actualizarCategoria(categoria: CategoriaProducto): Promise<void> {
        const actualizado = await this.repository.actualizarCategoria(categoria);

        if (!actualizado) {
            throw new Error("La categoría no existe.");
        }
    }

    async eliminarCategoria(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarCategoria(id);

        if (!eliminado) {
            throw new Error("La categoría no existe.");
        }
    }
}