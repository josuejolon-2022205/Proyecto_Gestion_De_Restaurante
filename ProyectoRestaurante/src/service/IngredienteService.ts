import { IngredienteRepository } from "../data/ingredienteRepository";
import { Ingrediente } from "../models/Ingrediente";

export class IngredienteService {

    private repository = new IngredienteRepository();

    async obtenerIngredientes(): Promise<Ingrediente[]> {
        return await this.repository.obtenerIngredientes();
    }

    async obtenerIngredientePorId(id: number): Promise<Ingrediente | undefined> {
        return await this.repository.obtenerIngredientePorId(id);
    }

    async guardarIngrediente(ingrediente: Ingrediente): Promise<void> {
        const existe = await this.repository.obtenerIngredientePorId(ingrediente.idIngrediente);

        if (existe) {
            throw new Error("El ID de ingrediente ya existe.");
        }

        await this.repository.guardarIngrediente(ingrediente);
    }

    async actualizarIngrediente(ingrediente: Ingrediente): Promise<void> {
        const actualizado = await this.repository.actualizarIngrediente(ingrediente);

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