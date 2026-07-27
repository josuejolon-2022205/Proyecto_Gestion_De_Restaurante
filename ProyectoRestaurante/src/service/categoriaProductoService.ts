import { CategoriaProductoRepository } from "../data/categoriaProductoRepository";
import { CategoriaProducto } from "../models/CategoriaProducto";
import { categoriaProductoSchema, categoriaProductoUpdateSchema } from "../validations/categoriaProductoValidator";
import { validate } from "../validations/validate";
import { NotFoundError } from "../errors/NotFoundError";

export class CategoriaProductoService {

    private repository = new CategoriaProductoRepository();

    async obtenerCategorias(): Promise<CategoriaProducto[]> {
        return await this.repository.obtenerCategorias();
    }

    async obtenerCategoriaPorId(id: number): Promise<CategoriaProducto | undefined> {
        return await this.repository.obtenerCategoriaPorId(id);
    }

    async guardarCategoria(categoria: unknown): Promise<CategoriaProducto> {
        const datosValidados = validate(categoriaProductoSchema, categoria);
        return await this.repository.guardarCategoria(datosValidados);
    }

    async actualizarCategoria(categoria: unknown): Promise<void> {
        const datosValidados = validate(categoriaProductoUpdateSchema, categoria);

        const existente = await this.repository.obtenerCategoriaPorId(datosValidados.idCategoriaProducto);
        if (!existente) {
            throw new NotFoundError("La categoría no existe.");
        }

        const categoriaCompleta: CategoriaProducto = { ...existente, ...datosValidados };

        const actualizado = await this.repository.actualizarCategoria(categoriaCompleta);
        if (!actualizado) {
            throw new NotFoundError("La categoría no existe.");
        }
    }

    async eliminarCategoria(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarCategoria(id);

        if (!eliminado) {
            throw new NotFoundError("La categoría no existe.");
        }
    }
}