import { MovimientoInventarioRepository } from "../data/movimientoInventarioRepository";
import { MovimientoInventario } from "../models/moviemientoInventario";

export class MovimientoInventarioService {

    private repository = new MovimientoInventarioRepository();

    async obtenerMovimientos(): Promise<MovimientoInventario[]> {
        return await this.repository.obtenerMovimientos();
    }

    async obtenerMovimientoPorId(id: number): Promise<MovimientoInventario | undefined> {
        return await this.repository.obtenerMovimientoPorId(id);
    }

    async obtenerMovimientosPorIngrediente(idIngrediente: number): Promise<MovimientoInventario[]> {
        return await this.repository.obtenerMovimientosPorIngrediente(idIngrediente);
    }

    async guardarMovimiento(movimiento: MovimientoInventario): Promise<void> {
        const existe = await this.repository.obtenerMovimientoPorId(movimiento.idMovimiento);

        if (existe) {
            throw new Error("El ID de movimiento ya existe.");
        }

        await this.repository.guardarMovimiento(movimiento);
    }

    async actualizarMovimiento(movimiento: MovimientoInventario): Promise<void> {
        const actualizado = await this.repository.actualizarMovimiento(movimiento);

        if (!actualizado) {
            throw new Error("El movimiento no existe.");
        }
    }

    async eliminarMovimiento(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarMovimiento(id);

        if (!eliminado) {
            throw new Error("El movimiento no existe.");
        }
    }
}