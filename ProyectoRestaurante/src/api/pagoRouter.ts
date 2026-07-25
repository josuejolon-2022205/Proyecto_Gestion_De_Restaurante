import { IncomingMessage, ServerResponse } from "http";
import { PagoService } from "../service/pagoService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { routeHandler } from "../utils/routeHandler";

const service = new PagoService();

export async function routerPago(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/pagos") {
            sendJson(res, 200, await service.obtenerPagos());
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "pagos") {
            const id = Number(partes[2]);
            const pago = await service.obtenerPagoPorId(id);

            if (!pago) {
                sendJson(res, 404, { error: "El id no existe" });
                return;
            }

            sendJson(res, 200, pago);
            return;
        }

        if (metodo === "POST" && url === "/pagos") {
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const p = JSON.parse(body);
                await service.guardarPago(p);
                sendJson(res, 201, { mensaje: "Pago registrado correctamente" });
            });
            return;
        }

        return

    } catch (error) {
        sendJson(res, 500, { error: (error as Error).message });
    }
}
