import { z } from "zod";

export const cargoSchema = z.object({
    nombreCargo: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(50, "Máximo 50 caracteres").regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras y espacios"),
    descripcionCargo: z.string().min(5, "La descripción debe tener al menos 5 caracteres").max(500, "Máximo 500 caracteres"),
});

export const cargoUpdateSchema = cargoSchema.partial().extend({
    idCargo: z.number().int().positive("El ID debe ser un número positivo"),
});