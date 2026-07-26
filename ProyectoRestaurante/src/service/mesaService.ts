import { MesaRepository } from "../data/mesaRepository";
import { Mesa } from "../models/Mesa";
import { mesaSchema, mesaUpdateSchema } from "../validations/mesaValidator";
import { validate } from "../validations/validate";
import { NotFoundError } from "../errors/NotFoundError";

export class MesaService {

    private repository = new MesaRepository();

    async obtenerMesas(): Promise<Mesa[]> {
        return await this.repository.obtenerMesas();
    }

    async obtenerMesaPorId(id: number): Promise<Mesa | undefined> {
        return await this.repository.obtenerMesaPorId(id);
    }

    async guardarMesa(mesa: unknown): Promise<Mesa> {
        const datosValidados = validate(mesaSchema, mesa);
        return await this.repository.guardarMesa(datosValidados);
    }

    async actualizarMesa(mesa: unknown): Promise<void> {
        const datosValidados = validate(mesaUpdateSchema, mesa);
        const actualizado = await this.repository.actualizarMesa(datosValidados as unknown as Mesa);

        if (!actualizado) {
            throw new NotFoundError("La mesa no existe.");
        }
    }

    async eliminarMesa(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarMesa(id);

        if (!eliminado) {
            throw new NotFoundError("La mesa no existe.");
        }
    }
}