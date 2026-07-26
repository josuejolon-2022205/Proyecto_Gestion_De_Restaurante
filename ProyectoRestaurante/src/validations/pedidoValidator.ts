import { z } from "zod";
import { estadoPedido } from "../enums/EstadoPedido";

export const pedidoSchema = z.object({
    fechaPedido: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato: YYYY-MM-DD"),
    horaPedido: z.string()
        .regex(/^\d{2}:\d{2}:\d{2}$/, "Formato: HH:MM:SS"),
    estadoPedido: z.nativeEnum(estadoPedido, {
        message: "Estado inválido. Use: PREPARACION, ENTREGADO o CANCELADO"
    }),
    total: z.number()
        .positive("El total debe ser mayor a 0")
        .max(999999.99, "Total excede el límite"),
    fkIdCliente: z.number().int().positive("ID de cliente inválido"),
    fkIdMesa: z.number().int().positive("ID de mesa inválido"),
    fkIdEmpleado: z.number().int().positive("ID de empleado inválido"),
});

export const pedidoUpdateSchema = pedidoSchema.partial().extend({
    idPedido: z.number().int().positive("El ID debe ser positivo"),
});