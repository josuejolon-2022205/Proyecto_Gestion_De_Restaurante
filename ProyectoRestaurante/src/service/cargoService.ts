import { CargoRepository } from "../data/cargoRepository";
import { Cargo } from "../models/Cargo";
import { cargoSchema, cargoUpdateSchema } from "../validations/cargoValidator";
import { validate } from "../validations/validate";
import { NotFoundError } from "../errors/NotFoundError";

export class CargoService {

    private repository = new CargoRepository();

    async obtenerCargos(): Promise<Cargo[]> {
        return await this.repository.obtenerCargos();
    }

    async obtenerCargoPorId(id: number): Promise<Cargo | undefined> {
        return await this.repository.obtenerCargoPorId(id);
    }

    async guardarCargo(cargo: unknown): Promise<Cargo> {
        const datosValidados = validate(cargoSchema, cargo);
        return await this.repository.guardarCargo(datosValidados);
    }

    async actualizarCargo(cargo: unknown): Promise<void> {
        const datosValidados = validate(cargoUpdateSchema, cargo);

        const existente = await this.repository.obtenerCargoPorId(datosValidados.idCargo);
        if (!existente) {
            throw new NotFoundError("El cargo no existe.");
        }

        const cargoCompleto: Cargo = { ...existente, ...datosValidados };

        const actualizado = await this.repository.actualizarCargo(cargoCompleto);
        if (!actualizado) {
            throw new NotFoundError("El cargo no existe.");
        }
    }

    async eliminarCargo(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarCargo(id);
        
        if (!eliminado) {
            throw new NotFoundError("El cargo no existe.");
        }
    }
}