import { ProductoIngredienteRepository } from "../data/productoIngredienteRepository";
import { ProductoIngrediente } from "../models/productoIngrediente";
import { productoIngredienteSchema, productoIngredienteUpdateSchema } from "../validations/productoIngredienteValidator";
import { validate } from "../validations/validate";
import { NotFoundError } from "../errors/NotFoundError";

export class ProductoIngredienteService {

    private repository = new ProductoIngredienteRepository();

    async obtenerProductoIngredientes(): Promise<ProductoIngrediente[]> {
        return await this.repository.obtenerProductoIngredientes();
    }

    async obtenerProductoIngredientePorId(id: number): Promise<ProductoIngrediente | undefined> {
        return await this.repository.obtenerProductoIngredientePorId(id);
    }

    async guardarProductoIngrediente(pi: unknown): Promise<ProductoIngrediente> {
        const datosValidados = validate(productoIngredienteSchema, pi);
        return await this.repository.guardarProductoIngrediente(datosValidados);
    }

    async actualizarProductoIngrediente(pi: unknown): Promise<void> {
        const datosValidados = validate(productoIngredienteUpdateSchema, pi);

        const existente = await this.repository.obtenerProductoIngredientePorId(datosValidados.idProductoIngrediente);
        if (!existente) {
            throw new NotFoundError("El producto ingrediente no existe.");
        }

        const piCompleto: ProductoIngrediente = { ...existente, ...datosValidados };

        const actualizado = await this.repository.actualizarProductoIngrediente(piCompleto);
        if (!actualizado) {
            throw new NotFoundError("El producto ingrediente no existe.");
        }
    }

    async eliminarProductoIngrediente(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarProductoIngrediente(id);

        if (!eliminado) {
            throw new NotFoundError("El producto ingrediente no existe.");
        }
    }
}