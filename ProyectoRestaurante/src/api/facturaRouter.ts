import { IncomingMessage, ServerResponse } from "http";
import { FacturaService } from "../service/facturaService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { routeHandler } from "../utils/routeHandler";

const service = new FacturaService();

export async function routerFactura(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/facturas") {
            sendJson(res, 200, await service.obtenerFacturas());
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "facturas") {
            const id = Number(partes[2]);
            const factura = await service.obtenerFacturaPorId(id);

            if (!factura) {
                sendJson(res, 404, { error: "El id no existe" });
                return;
            }

            sendJson(res, 200, factura);
            return;
        }

        if (metodo === "POST" && url === "/facturas") {
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const f = JSON.parse(body);
                await service.guardarFactura(f);
                sendJson(res, 201, { mensaje: "Factura generada correctamente" });
            });
            return;
        }

        sendJson(res, 404, { error: "No se encontro la ruta" });

    } catch (error) {
        sendJson(res, 500, { error: (error as Error).message });
    }
}