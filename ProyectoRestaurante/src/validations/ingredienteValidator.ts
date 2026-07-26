import { z } from "zod";

const ingredienteBaseSchema = z.object({
    nombreIngrediente: z.string().min(2).max(100),
    stockActual: z.number().min(0).max(999999.99),
    stockMinimo: z.number().min(0).max(999999.99),
    fkIdProveedor: z.number().int().positive(),
});

export const ingredienteSchema = ingredienteBaseSchema.refine(
    (data) => data.stockMinimo <= data.stockActual,
    { message: "Stock mínimo no puede ser mayor al actual", path: ["stockMinimo"] }
);

export const ingredienteUpdateSchema = z.object({
    idIngrediente: z.number().int().positive("El ID debe ser positivo"),
    nombreIngrediente: z.string().min(2).max(100).optional(),
    stockActual: z.number().min(0).max(999999.99).optional(),
    stockMinimo: z.number().min(0).max(999999.99).optional(),
    fkIdProveedor: z.number().int().positive().optional(),
}).refine(
    (data) => {
        if (data.stockActual !== undefined && data.stockMinimo !== undefined) {
            return data.stockMinimo <= data.stockActual;
        }
        return true;
    },
    { message: "Stock mínimo no puede ser mayor al actual", path: ["stockMinimo"] }
);