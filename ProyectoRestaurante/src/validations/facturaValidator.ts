import { z } from "zod";

export const facturaSchema = z.object({
    numeroFactura: z.string()
        .min(1, "El número de factura es requerido")
        .max(50, "Máximo 50 caracteres"),
    fechaFactura: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, "Formato: YYYY-MM-DDTHH:MM:SS"),
    nitCliente: z.string()
        .min(1, "El NIT es requerido")
        .max(20, "Máximo 20 caracteres"),
    nombreFacturacion: z.string()
        .min(2, "Mínimo 2 caracteres")
        .max(100, "Máximo 100 caracteres"),
    totalFactura: z.number()
        .positive("El total debe ser mayor a 0")
        .max(999999.99, "Total excede el límite"),
    fkIdPago: z.number().int().positive("ID de pago inválido"),
});

export const facturaUpdateSchema = facturaSchema.partial().extend({
    idFactura: z.number().int().positive("El ID debe ser positivo"),
});