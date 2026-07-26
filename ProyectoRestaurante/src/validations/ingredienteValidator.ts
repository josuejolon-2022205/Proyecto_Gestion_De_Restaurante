import { z } from "zod";

export const ingredienteSchema = z.object({
    nombreIngrediente: z.string().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres"),
    stockActual: z.number().min(0, "El stock no puede ser negativo").max(999999.99, "Stock excede el límite"),
    stockMinimo: z.number().min(0, "El stock mínimo no puede ser negativo").max(999999.99, "Stock mínimo excede el límite"),
    fkIdProveedor: z.number().int().positive("ID de proveedor inválido"),
    
}).refine((data) => data.stockMinimo <= data.stockActual, {
    message: "El stock mínimo no puede ser mayor al stock actual",
    path: ["stockMinimo"],
});

export const ingredienteUpdateSchema = ingredienteSchema.partial().extend({
    idIngrediente: z.number().int().positive("El ID debe ser positivo"),
});