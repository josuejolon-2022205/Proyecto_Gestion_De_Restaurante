import { IncomingMessage, ServerResponse } from "http";
import { MovimientoInventarioService } from "../service/movimientoInventarioService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { routeHandler } from "../utils/routeHandler";

const service = new MovimientoInventarioService();

export async function routerMovimientoInventario(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/movimientos") {
            sendJson(res, 200, await service.obtenerMovimientos());
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "movimientos") {
            const id = Number(partes[2]);
            const movimiento = await service.obtenerMovimientoPorId(id);

            if (!movimiento) {
                sendJson(res, 404, { error: "El id no existe" });
                return;
            }

            sendJson(res, 200, movimiento);
            return;
        }

        if (metodo === "POST" && url === "/movimientos") {
            const body = await ReadBody(req);
            await routeHandler(res, async () => {
                const m = JSON.parse(body);
                const nuevo = await service.guardarMovimiento(m);
                sendJson(res, 201, { mensaje: "Movimiento registrado correctamente", movimiento: nuevo });
            });
            return;
        }

        return 

    } catch (error) {
        sendJson(res, 500, { error: (error as Error).message });
    }
}