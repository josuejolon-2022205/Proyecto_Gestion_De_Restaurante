import { z } from "zod";

const detallePedidoBaseSchema = z.object({
    cantidad: z.number().int().min(1, "La cantidad mínima es 1").max(999, "La cantidad máxima es 999"),
    precioUnitario: z.number().positive("El precio debe ser mayor a 0").max(999999.99, "Precio excede el límite"),
    subtotal: z.number().positive("El subtotal debe ser mayor a 0").max(999999.99, "Subtotal excede el límite"),
    fkIdPedido: z.number().int().positive("ID de pedido inválido"),
    fkIdProducto: z.number().int().positive("ID de producto inválido"),
});

export const detallePedidoSchema = detallePedidoBaseSchema.refine(
    (data) => {
        const calculated = Number((data.cantidad * data.precioUnitario).toFixed(2));
        return calculated === Number(data.subtotal.toFixed(2));
    },
    {
        message: "El subtotal debe ser cantidad × precio unitario",
        path: ["subtotal"],
    }
);


export const detallePedidoUpdateSchema = z.object({
    idDetallePedido: z.number().int().positive("El ID debe ser positivo"),
    cantidad: z.number().int().min(1).max(999).optional(),
    precioUnitario: z.number().positive().max(999999.99).optional(),
    subtotal: z.number().positive().max(999999.99).optional(),
    fkIdPedido: z.number().int().positive().optional(),
    fkIdProducto: z.number().int().positive().optional(),
}).refine(
    (data) => {
        
        if (data.cantidad !== undefined && data.precioUnitario !== undefined && data.subtotal !== undefined) {
            const calculated = Number((data.cantidad * data.precioUnitario).toFixed(2));
            return calculated === Number(data.subtotal.toFixed(2));
        }
        return true;
    },
    {
        message: "El subtotal debe ser cantidad × precio unitario",
        path: ["subtotal"],
    }
);