import { IngredienteRepository } from "../data/ingredienteRepository";
import { Ingrediente } from "../models/Ingrediente";
import { ingredienteSchema, ingredienteUpdateSchema } from "../validations/ingredienteValidator";
import { validate } from "../validations/validate";
import { NotFoundError } from "../errors/NotFoundError";

export class IngredienteService {

    private repository = new IngredienteRepository();

    async obtenerIngredientes(): Promise<Ingrediente[]> {
        return await this.repository.obtenerIngredientes();
    }

    async obtenerIngredientePorId(id: number): Promise<Ingrediente | undefined> {
        return await this.repository.obtenerIngredientePorId(id);
    }

    // Cambiado: ahora acepta unknown
    async guardarIngrediente(ingrediente: unknown): Promise<Ingrediente> {
        const datosValidados = validate(ingredienteSchema, ingrediente);
        return await this.repository.guardarIngrediente(datosValidados as Ingrediente);
    }

    // Cambiado: ahora acepta unknown
    async actualizarIngrediente(ingrediente: unknown): Promise<void> {
        const datosValidados = validate(ingredienteUpdateSchema, ingrediente);

        const existente = await this.repository.obtenerIngredientePorId(datosValidados.idIngrediente);
        if (!existente) {
            throw new NotFoundError("El ingrediente no existe.");
        }

        const ingredienteCompleto: Ingrediente = { ...existente, ...datosValidados };

        const actualizado = await this.repository.actualizarIngrediente(ingredienteCompleto);
        if (!actualizado) {
            throw new NotFoundError("El ingrediente no existe.");
        }
    }

    async eliminarIngrediente(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarIngrediente(id);
        if (!eliminado) {
            throw new NotFoundError("El ingrediente no existe.");
        }
    }
}