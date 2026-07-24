import { MesaRepository } from "../data/mesaRepository";
import { Mesa } from "../models/Mesa";

export class MesaService {

    private repository = new MesaRepository();

    async obtenerMesas(): Promise<Mesa[]> {
        return await this.repository.obtenerMesas();
    }

    async obtenerMesaPorId(id: number): Promise<Mesa | undefined> {
        return await this.repository.obtenerMesaPorId(id);
    }

    async guardarMesa(mesa: Mesa): Promise<void> {
        const existe = await this.repository.obtenerMesaPorId(mesa.idMesa);

        if(existe) {
            throw new Error("El ID de mesa ya existe.");
        }

        const numeroExiste = await this.repository.obtenerMesaPorNumero(mesa.numeroMesa);

        if(numeroExiste) {
            throw new Error("El número de mesa ya existe.");
        }

        await this.repository.guardarMesa(mesa);
    }

    async actualizarMesa(mesa: Mesa): Promise<void> {
        const actualizado = await this.repository.actualizarMesa(mesa);

        if(!actualizado) {
            throw new Error("La mesa no existe.");
        }
    }

    async eliminarMesa(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarMesa(id);

        if (!eliminado) {
            throw new Error("La mesa no existe.");
        }
    }
}