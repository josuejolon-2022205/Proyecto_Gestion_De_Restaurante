import { z } from "zod";

export const productoSchema = z.object({
    nombreProducto: z.string()
        .min(2, "Mínimo 2 caracteres")
        .max(100, "Máximo 100 caracteres"),
    descripcionProducto: z.string()
        .min(5, "Mínimo 5 caracteres")
        .max(1000, "Máximo 1000 caracteres"),
    precio: z.number()
        .positive("El precio debe ser mayor a 0")
        .max(999999.99, "Precio excede el límite"),
    disponibilidad: z.number().int()
        .min(0, "La disponibilidad mínima es 0")
        .max(1, "La disponibilidad máxima es 1"),
    fkIdCategoria: z.number().int().positive("ID de categoría inválido"),
});

export const productoUpdateSchema = productoSchema.partial().extend({
    idProducto: z.number().int().positive("El ID debe ser positivo"),
});