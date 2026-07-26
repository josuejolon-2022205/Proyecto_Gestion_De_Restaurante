import { z } from "zod";

export const productoIngredienteSchema = z.object({
    cantidadUtilizada: z.number()
        .positive("La cantidad debe ser mayor a 0")
        .max(999999.99, "Cantidad excede el límite"),
    fkIdProducto: z.number().int().positive("ID de producto inválido"),
    fkIdIngrediente: z.number().int().positive("ID de ingrediente inválido"),
});

export const productoIngredienteUpdateSchema = productoIngredienteSchema.partial().extend({
    idProductoIngrediente: z.number().int().positive("El ID debe ser positivo"),
});