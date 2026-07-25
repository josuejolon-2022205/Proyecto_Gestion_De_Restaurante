import { IncomingMessage, ServerResponse } from "http";
import { ReservaService } from "../service/reservaService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { routeHandler } from "../utils/routeHandler";

const service = new ReservaService();

export async function routerReserva(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/reservas") {
            sendJson(res, 200, await service.obtenerReservas());
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "reservas") {
            const id = Number(partes[2]);
            const reserva = await service.obtenerReservaPorId(id);

            if (!reserva) {
                sendJson(res, 404, { error: "El id no existe" });
                return;
            }

            sendJson(res, 200, reserva);
            return;
        }

        if (metodo === "POST" && url === "/reservas") {
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const r = JSON.parse(body);
                await service.guardarReserva(r);
                sendJson(res, 201, { mensaje: "Reserva agregada correctamente" });
            });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "reservas") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const r = JSON.parse(body);
                r.idReserva = id;
                await service.actualizarReserva(r);
                sendJson(res, 200, { mensaje: "Reserva actualizada" });
            });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "reservas") {
            const id = Number(partes[2]);
            await service.eliminarReserva(id);
            sendJson(res, 200, { mensaje: "Reserva eliminada" });
            return;
        }

        sendJson(res, 404, { error: "No se encontro la ruta" });

    } catch (error) {
        sendJson(res, 500, { error: (error as Error).message });
    }
}