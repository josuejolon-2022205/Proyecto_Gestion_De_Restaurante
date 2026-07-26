import { z } from "zod";
import { estadoMesa } from "../enums/EstadoMesa";

export const mesaSchema = z.object({
    estadoMesa: z.nativeEnum(estadoMesa, {
        message: "Estado inválido. Use: OCUPADA, RESERVADA o LIBRE"
    }),
    numeroMesa: z.number().int()
        .min(1, "El número de mesa mínimo es 1")
        .max(999, "El número de mesa máximo es 999"),
    capacidad: z.number().int()
        .min(1, "La capacidad mínima es 1")
        .max(50, "La capacidad máxima es 50"),
});

export const mesaUpdateSchema = mesaSchema.partial().extend({
    idMesa: z.number().int().positive("El ID debe ser positivo"),
});