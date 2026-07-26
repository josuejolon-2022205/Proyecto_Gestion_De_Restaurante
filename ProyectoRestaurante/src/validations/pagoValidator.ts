import { z } from "zod";
import { TiposDePago } from "../enums/tiposDePago";

export const pagoSchema = z.object({
    fechaPago: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, "Formato: YYYY-MM-DDTHH:MM:SS"),
    monto: z.number()
        .positive("El monto debe ser mayor a 0")
        .max(999999.99, "Monto excede el límite"),
    metodoPago: z.nativeEnum(TiposDePago, {
        message: "Método inválido. Use: EFECTIVO, TARJETA o TRANSFERENCIA"
    }),
    fkIdPedido: z.number().int().positive("ID de pedido inválido"),
});

export const pagoUpdateSchema = pagoSchema.partial().extend({
    idPago: z.number().int().positive("El ID debe ser positivo"),
});