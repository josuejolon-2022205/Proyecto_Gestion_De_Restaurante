import { z } from "zod";

const telefonoRegex = /^\d{8,10}$/;

export const clienteSchema = z.object({
    nombreCliente: z.string().min(2, "Mínimo 2 caracteres").max(50, "Máximo 50 caracteres").regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras y espacios"),
    apellidosCliente: z.string().min(2, "Mínimo 2 caracteres").max(50, "Máximo 50 caracteres").regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras y espacios"),
    telefonoCliente: z.string().regex(telefonoRegex, "Teléfono debe tener 8-10 dígitos numéricos"),
    correoCliente: z.string().email("Correo electrónico inválido").max(80, "Máximo 80 caracteres"),
});

export const clienteUpdateSchema = clienteSchema.partial().extend({
    idCliente: z.number().int().positive("El ID debe ser positivo"),
});