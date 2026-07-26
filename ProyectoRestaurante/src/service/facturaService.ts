import { FacturaRepository } from "../data/facturaRepository";
import { Factura } from "../models/Factura";
import { facturaSchema } from "../validations/facturaValidator";
import { validate } from "../validations/validate";

export class FacturaService {

    private repository = new FacturaRepository();

    async obtenerFacturas(): Promise<Factura[]> {
        return await this.repository.obtenerFacturas();
    }

    async obtenerFacturaPorId(id: number): Promise<Factura | undefined> {
        return await this.repository.obtenerFacturaPorId(id);
    }

    async guardarFactura(factura: Omit<Factura, "idFactura">): Promise<Factura> {
        const datosValidados = validate(facturaSchema, factura);
        
        return await this.repository.guardarFactura(datosValidados);
    }

    async actualizarFactura(factura: Factura): Promise<void> {
        const datosValidados = validate(facturaSchema, factura);
        const actualizado = await this.repository.actualizarFactura(datosValidados as Factura);

        if (!actualizado) {
            throw new Error("La factura no existe.");
        }
    }

    async eliminarFactura(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarFactura(id);

        if (!eliminado) {
            throw new Error("La factura no existe.");
        }
    }
}