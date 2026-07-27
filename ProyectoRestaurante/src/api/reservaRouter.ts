import { IncomingMessage, ServerResponse } from "http";
import { ReservaService } from "../service/reservaService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { handleError } from "../utils/errorHandler";
import { NotFoundError } from "../errors/NotFoundError";

const service = new ReservaService();

export async function routerReserva(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/reservas") {
            const reservas = await service.obtenerReservas();
            sendJson(res, 200, { status: "success", data: reservas });
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "reservas") {
            const id = Number(partes[2]);
            const reserva = await service.obtenerReservaPorId(id);

            if (!reserva) {
                throw new NotFoundError("La reserva no existe");
            }

            sendJson(res, 200, { status: "success", data: reserva });
            return;
        }

        if (metodo === "POST" && url === "/reservas") {
            const body = await ReadBody(req);
            const r = JSON.parse(body);
            const nuevo = await service.guardarReserva(r);
            sendJson(res, 201, { status: "success", message: "Reserva agregada", data: nuevo });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "reservas") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);
            const r = JSON.parse(body);
            r.idReserva = id;
            await service.actualizarReserva(r);
            sendJson(res, 200, { status: "success", message: "Reserva actualizada" });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "reservas") {
            const id = Number(partes[2]);
            await service.eliminarReserva(id);
            sendJson(res, 200, { status: "success", message: "Reserva eliminada" });
            return;
        }

        sendJson(res, 404, { status: "fail", message: "Ruta no encontrada" });

    } catch (error) {
        handleError(res, error);
    }
}