import { z } from "zod";

const telefonoRegex = /^\d{8,10}$/;

export const empleadoSchema = z.object({
    nombreEmpleado: z.string()
        .min(2, "Mínimo 2 caracteres")
        .max(100, "Máximo 100 caracteres")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras y espacios"),
    apellidoEmpleado: z.string()
        .min(2, "Mínimo 2 caracteres")
        .max(100, "Máximo 100 caracteres")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras y espacios"),
    telefonoEmpleado: z.string()
        .regex(telefonoRegex, "Teléfono debe tener 8-10 dígitos numéricos"),
    direccionEmpleado: z.string()
        .min(5, "Mínimo 5 caracteres")
        .max(150, "Máximo 150 caracteres"),
    salarioEmpleado: z.number()
        .positive("El salario debe ser mayor a 0")
        .max(999999.99, "Salario excede el límite"),
    fkIdCargo: z.number().int().positive("ID de cargo inválido"),
    fkIdUsuario: z.number().int().positive("ID de usuario inválido"),
});

export const empleadoUpdateSchema = empleadoSchema.partial().extend({
    idEmpleado: z.number().int().positive("El ID debe ser positivo"),
});