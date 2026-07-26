import { MovimientoInventarioRepository } from "../data/movimientoInventarioRepository";
import { MovimientoInventario } from "../models/moviemientoInventario";
import { movimientoInventarioSchema, movimientoInventarioUpdateSchema } from "../validations/movimientoInventarioValidator";
import { validate } from "../validations/validate";
import { NotFoundError } from "../errors/NotFoundError";

export class MovimientoInventarioService {

    private repository = new MovimientoInventarioRepository();

    async obtenerMovimientos(): Promise<MovimientoInventario[]> {
        return await this.repository.obtenerMovimientos();
    }

    async obtenerMovimientoPorId(id: number): Promise<MovimientoInventario | undefined> {
        return await this.repository.obtenerMovimientoPorId(id);
    }

    async guardarMovimiento(movimiento: unknown): Promise<MovimientoInventario> {
        const datosValidados = validate(movimientoInventarioSchema, movimiento);
        return await this.repository.guardarMovimiento(datosValidados as MovimientoInventario);
    }

    async actualizarMovimiento(movimiento: unknown): Promise<void> {
        const datosValidados = validate(movimientoInventarioUpdateSchema, movimiento);
        const actualizado = await this.repository.actualizarMovimiento(datosValidados as MovimientoInventario);

        if (!actualizado) {
            throw new NotFoundError("El movimiento no existe.");
        }
    }

    async eliminarMovimiento(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarMovimiento(id);

        if (!eliminado) {
            throw new NotFoundError("El movimiento no existe.");
        }
    }
}