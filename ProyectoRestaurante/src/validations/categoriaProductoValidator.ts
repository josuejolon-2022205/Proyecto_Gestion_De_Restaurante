import { z } from "zod";

export const categoriaProductoSchema = z.object({
    nombreCategoria: z.string()
        .min(2, "Mínimo 2 caracteres")
        .max(50, "Máximo 50 caracteres"),
    descripcionCategoria: z.string()
        .min(5, "Mínimo 5 caracteres")
        .max(500, "Máximo 500 caracteres"),
});

export const categoriaProductoUpdateSchema = categoriaProductoSchema.partial().extend({
    idCategoriaProducto: z.number().int().positive("El ID debe ser positivo"),
});