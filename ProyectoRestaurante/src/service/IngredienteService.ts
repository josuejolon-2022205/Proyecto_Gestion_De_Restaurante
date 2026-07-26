import { IngredienteRepository } from "../data/ingredienteRepository";
import { Ingrediente } from "../models/Ingrediente";
import { ingredienteSchema } from "../validations/ingredienteValidator";
import { validate } from "../validations/validate";

export class IngredienteService {

    private repository = new IngredienteRepository();

    async obtenerIngredientes(): Promise<Ingrediente[]> {
        return await this.repository.obtenerIngredientes();
    }

    async obtenerIngredientePorId(id: number): Promise<Ingrediente | undefined> {
        return await this.repository.obtenerIngredientePorId(id);
    }

    async guardarIngrediente(ingrediente: Omit<Ingrediente, "idIngrediente">): Promise<Ingrediente> {
        const datosValidados = validate(ingredienteSchema, ingrediente);
        return await this.repository.guardarIngrediente(datosValidados as Ingrediente);
    }

    async actualizarIngrediente(ingrediente: Ingrediente): Promise<void> {
        const datosValidados = validate(ingredienteSchema, ingrediente);
        const actualizado = await this.repository.actualizarIngrediente(datosValidados as Ingrediente);

        if (!actualizado) {
            throw new Error("El ingrediente no existe.");
        }
    }

    async eliminarIngrediente(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarIngrediente(id);

        if (!eliminado) {
            throw new Error("El ingrediente no existe.");
        }
    }
}