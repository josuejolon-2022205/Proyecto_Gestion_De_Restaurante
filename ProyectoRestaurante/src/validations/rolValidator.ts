import { z } from "zod";
import { Roles } from "../enums/Roles";

export const rolSchema = z.object({
    nombre: z.string()
        .min(2, "Mínimo 2 caracteres")
        .max(50, "Máximo 50 caracteres"),
    descripcion: z.string()
        .min(5, "Mínimo 5 caracteres")
        .max(200, "Máximo 200 caracteres"),
    roles: z.nativeEnum(Roles, {
        message: "Rol inválido. Use: ADMIN o USER"
    }),
});

export const rolUpdateSchema = rolSchema.partial().extend({
    idRol: z.number().int().positive("El ID debe ser positivo"),
});