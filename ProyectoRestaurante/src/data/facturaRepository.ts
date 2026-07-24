import { Factura } from "../models/Factura";
import { withTryCatch } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class FacturaRepository {

    private async _obtenerFacturas(): Promise<Factura[]> {
        const result = await conexion.query("select * from factura");
        return result.rows;
    }

    private async _obtenerFacturaPorId(id: number): Promise<Factura | undefined> {
        const result = await conexion.query("select * from factura where idFactura = $1", [id]);
        return result.rows[0];
    }

    private async _obtenerFacturaPorNumero(numero: string): Promise<Factura | undefined> {
        const result = await conexion.query("select * from factura where numeroFactura = $1", [numero]);
        return result.rows[0];
    }

    private async _guardarFactura(factura: Factura): Promise<void> {
        await conexion.query(
            "insert into factura (idFactura, numeroFactura, fechaFactura, nitCliente, nombreFacturacion, totalFactura, fkIdPago) values ($1, $2, $3, $4, $5, $6, $7)",
            [factura.idFactura, factura.numeroFactura, factura.fechaFactura, factura.nitCliente, factura.nombreFacturacion, factura.totalFactura, factura.fkIdPago]
        );
    }

    private async _actualizarFactura(facturaActualizada: Factura): Promise<boolean> {
        const result = await conexion.query(
            "update factura set numeroFactura = $1, fechaFactura = $2, nitCliente = $3, nombreFacturacion = $4, totalFactura = $5, fkIdPago = $6 where idFactura = $7",
            [facturaActualizada.numeroFactura, facturaActualizada.fechaFactura, facturaActualizada.nitCliente, facturaActualizada.nombreFacturacion, facturaActualizada.totalFactura, facturaActualizada.fkIdPago, facturaActualizada.idFactura]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarFactura(id: number): Promise<boolean> {
        const result = await conexion.query("delet from factura where idFactura = $1", [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerFacturas = withTryCatch(this._obtenerFacturas.bind(this), [], "Error al obtener facturas.");
    obtenerFacturaPorId = withTryCatch(this._obtenerFacturaPorId.bind(this), undefined, "Error al buscar factura por ID.");
    obtenerFacturaPorNumero = withTryCatch(this._obtenerFacturaPorNumero.bind(this), undefined, "Error al buscar factura por número.");
    guardarFactura = withTryCatch(this._guardarFactura.bind(this), undefined, "Error al guardar la factura.");
    actualizarFactura = withTryCatch(this._actualizarFactura.bind(this), false, "Error al actualizar la factura.");
    eliminarFactura = withTryCatch(this._eliminarFactura.bind(this), false, "Error al eliminar la factura.");
}