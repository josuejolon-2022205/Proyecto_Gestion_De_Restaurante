import { z } from "zod";

const telefonoRegex = /^\d{8,10}$/;

export const proveedorSchema = z.object({
    nombreProveedor: z.string()
        .min(2, "Mínimo 2 caracteres")
        .max(100, "Máximo 100 caracteres"),
    telefonoProveedor: z.string()
        .regex(telefonoRegex, "Teléfono debe tener 8-10 dígitos numéricos"),
    correoProveedor: z.string()
        .email("Correo electrónico inválido")
        .max(90, "Máximo 90 caracteres"),
    direccion: z.string()
        .min(5, "Mínimo 5 caracteres")
        .max(200, "Máximo 200 caracteres"),
});

export const proveedorUpdateSchema = proveedorSchema.partial().extend({
    idProveedor: z.number().int().positive("El ID debe ser positivo"),
});