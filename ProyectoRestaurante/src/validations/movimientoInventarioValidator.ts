import { z } from "zod";

export const movimientoInventarioSchema = z.object({
    cantidad: z.number().positive("La cantidad debe ser mayor a 0").max(999999.99, "Cantidad excede el límite"),
    fechaMovimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, "Formato: YYYY-MM-DDTHH:MM:SS"),
    descripcion: z.string().min(5, "Mínimo 5 caracteres").max(1000, "Máximo 1000 caracteres"),
    fkIdIngrediente: z.number().int().positive("ID de ingrediente inválido"),
});

export const movimientoInventarioUpdateSchema = movimientoInventarioSchema.partial().extend({
    idMovimiento: z.number().int().positive("El ID debe ser positivo"),
});