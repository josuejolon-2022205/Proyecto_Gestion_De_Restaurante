import { CargoRepository } from "../data/cargoRepository";
import { Cargo } from "../models/Cargo";

export class CargoService {

    private repository = new CargoRepository();

    async obtenerCargos(): Promise<Cargo[]> {
        return await this.repository.obtenerCargos();
    }

    async obtenerCargoPorId(id: number): Promise<Cargo | undefined> {
        return await this.repository.obtenerCargoPorId(id);
    }

    async guardarCargo(cargo: Cargo): Promise<void> {
        const existe = await this.repository.obtenerCargoPorId(cargo.idCargo);

        if(existe) {
            throw new Error("El ID de cargo ya existe.");
        }
        await this.repository.guardarCargo(cargo);
    }

    async actualizarCargo(cargo: Cargo): Promise<void> {
        const actualizado = await this.repository.actualizarCargo(cargo);

        if(!actualizado) {
            throw new Error("El cargo no existe.");
        }
    }

    async eliminarCargo(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarCargo(id);

        if(!eliminado) {
            throw new Error("El cargo no existe.");
        }
    }
}