import { z } from "zod";
import { estadoPedido } from "../enums/EstadoPedido";

export const pedidoSchema = z.object({
    fechaPedido: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato fecha: YYYY-MM-DD"),
    horaPedido: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, "Formato hora: HH:MM:SS"),
    estadoPedido: z.nativeEnum(estadoPedido).default(estadoPedido.PREPARACION),
    total: z.coerce.number().positive("El total debe ser mayor a 0").max(999999.99, "Total excede el límite"),
    fkIdCliente: z.coerce.number().int().positive("ID de cliente inválido"),
    fkIdMesa: z.coerce.number().int().positive("ID de mesa inválido"),
    fkIdEmpleado: z.coerce.number().int().positive("ID de empleado inválido"),
});

export const pedidoUpdateSchema = pedidoSchema.partial().extend({
    idPedido: z.coerce.number().int().positive("El ID debe ser positivo"),
});