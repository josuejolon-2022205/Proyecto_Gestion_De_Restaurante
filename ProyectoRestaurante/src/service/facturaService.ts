import { FacturaRepository } from "../data/facturaRepository";
import { Factura } from "../models/Factura";

export class FacturaService {

    private repository = new FacturaRepository();

    async obtenerFacturas(): Promise<Factura[]> {
        return await this.repository.obtenerFacturas();
    }

    async obtenerFacturaPorId(id: number): Promise<Factura | undefined> {
        return await this.repository.obtenerFacturaPorId(id);
    }

    async guardarFactura(factura: Factura): Promise<void> {
        const existe = await this.repository.obtenerFacturaPorId(factura.idFactura);

        if (existe) {
            throw new Error("El ID de factura ya existe.");
        }

        const numeroExiste = await this.repository.obtenerFacturaPorNumero(factura.numeroFactura);

        if (numeroExiste) {
            throw new Error("El número de factura ya existe.");
        }

        await this.repository.guardarFactura(factura);
    }

    async actualizarFactura(factura: Factura): Promise<void> {
        const actualizado = await this.repository.actualizarFactura(factura);

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