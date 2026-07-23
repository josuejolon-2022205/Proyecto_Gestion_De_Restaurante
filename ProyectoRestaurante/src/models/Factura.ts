export interface Factura {
    idFactura: number;
    numeroFactura: string;
    fechaFactura: string;
    nitCliente: string;
    nombreFacturacion: string;
    totalFactura: number;
    fkIdPago: number;
}