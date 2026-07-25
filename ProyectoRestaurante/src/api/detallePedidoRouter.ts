import { IncomingMessage, ServerResponse } from "http";
import { DetallePedidoService } from "../service/detallePedidoService";
import { sendJson } from "./sendJSON";

const service = new DetallePedidoService();

export async function routerDetallePedido(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/detalles") {
            sendJson(res, 200, await service.obtenerDetalles());
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "detalles") {
            const id = Number(partes[2]);
            const detalle = await service.obtenerDetallePorId(id);

            if (!detalle) {
                sendJson(res, 404, { error: "El id no existe" });
                return;
            }

            sendJson(res, 200, detalle);
            return;
        }

        if (metodo === "GET" && partes.length === 4 && partes[1] === "pedidos" && partes[3] === "detalles") {
            const idPedido = Number(partes[2]);
            sendJson(res, 200, await service.obtenerDetallesPorPedido(idPedido));
            return;
        }

        sendJson(res, 404, { error: "No se encontro la ruta" });

    } catch (error) {
        sendJson(res, 500, { error: (error as Error).message });
    }
}