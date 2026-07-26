import { z } from "zod";
import { Estado } from "../enums/Estado";

export const usuarioSchema = z.object({
    nombreUsuario: z.string()
        .min(3, "Mínimo 3 caracteres")
        .max(50, "Máximo 50 caracteres")
        .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guión bajo"),
    correo: z.string()
        .email("Correo electrónico inválido")
        .max(80, "Máximo 80 caracteres"),
    contrasena: z.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .max(80, "Máximo 80 caracteres"),
    estado: z.nativeEnum(Estado, {
        message: "Estado inválido. Use: ACTIVO, INACTIVO o BLOQUEADO"
    }),
    fkIdRol: z.number().int().positive("ID de rol inválido"),
});

export const usuarioUpdateSchema = usuarioSchema.partial().extend({
    idUsuario: z.number().int().positive("El ID debe ser positivo"),
});