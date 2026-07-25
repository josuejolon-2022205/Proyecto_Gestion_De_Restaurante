import { IncomingMessage, ServerResponse } from "http";
import { PedidoService } from "../service/pedidoService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { routeHandler } from "../utils/routeHandler";

const service = new PedidoService();

export async function routerPedido(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/pedidos") {
            sendJson(res, 200, await service.obtenerPedidos());
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "pedidos") {
            const id = Number(partes[2]);
            const pedido = await service.obtenerPedidoPorId(id);

            if (!pedido) {
                sendJson(res, 404, { error: "El id no existe" });
                return;
            }

            sendJson(res, 200, pedido);
            return;
        }

        if (metodo === "POST" && url === "/pedidos") {
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const p = JSON.parse(body);
                await service.guardarPedido(p);
                sendJson(res, 201, { mensaje: "Pedido agregado correctamente" });
            });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "pedidos") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const p = JSON.parse(body);
                p.idPedido = id;
                await service.actualizarPedido(p);
                sendJson(res, 200, { mensaje: "Pedido actualizado" });
            });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "pedidos") {
            const id = Number(partes[2]);
            await service.eliminarPedido(id);
            sendJson(res, 200, { mensaje: "Pedido eliminado" });
            return;
        }

        return 

    } catch (error) {
        sendJson(res, 500, { error: (error as Error).message });
    }
}