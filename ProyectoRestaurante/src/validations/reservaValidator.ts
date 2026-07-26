import { z } from "zod";
import { estadoReserva } from "../enums/EstadoReserva";

export const reservaSchema = z.object({
    fechaReserva: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato: YYYY-MM-DD"),
    horaReserva: z.string()
        .regex(/^\d{2}:\d{2}:\d{2}$/, "Formato: HH:MM:SS"),
    cantidadPersonas: z.number().int()
        .min(1, "Mínimo 1 persona")
        .max(50, "Máximo 50 personas"),
    estado: z.nativeEnum(estadoReserva, {
        message: "Estado inválido. Use: ACTIVO, INACTIVO o CANCELADO"
    }),
    fkIdCliente: z.number().int().positive("ID de cliente inválido"),
    fkIdMesa: z.number().int().positive("ID de mesa inválido"),
}).refine((data) => {
    const fechaHora = new Date(`${data.fechaReserva}T${data.horaReserva}`);
    return fechaHora > new Date();
}, {
    message: "La fecha y hora de la reserva deben ser futuras",
    path: ["fechaReserva"],
});

export const reservaUpdateSchema = reservaSchema.partial().extend({
    idReserva: z.number().int().positive("El ID debe ser positivo"),
});