import { IncomingMessage, ServerResponse } from "http";
import { MesaService } from "../service/mesaService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { routeHandler } from "../utils/routeHandler";

const service = new MesaService();

export async function routerMesa(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/mesas") {
            sendJson(res, 200, await service.obtenerMesas());
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "mesas") {
            const id = Number(partes[2]);
            const mesa = await service.obtenerMesaPorId(id);

            if (!mesa) {
                sendJson(res, 404, { error: "El id no existe" });
                return;
            }

            sendJson(res, 200, mesa);
            return;
        }

        if (metodo === "POST" && url === "/mesas") {
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const m = JSON.parse(body);
                await service.guardarMesa(m);
                sendJson(res, 201, { mensaje: "Mesa agregada correctamente" });
            });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "mesas") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const m = JSON.parse(body);
                m.idMesa = id;
                await service.actualizarMesa(m);
                sendJson(res, 200, { mensaje: "Mesa actualizada" });
            });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "mesas") {
            const id = Number(partes[2]);
            await service.eliminarMesa(id);
            sendJson(res, 200, { mensaje: "Mesa eliminada" });
            return;
        }

        return

    } catch (error) {
        sendJson(res, 500, { error: (error as Error).message });
    }
}