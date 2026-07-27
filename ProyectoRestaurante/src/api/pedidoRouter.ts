import { IncomingMessage, ServerResponse } from "http";
import { PedidoService } from "../service/pedidoService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { handleError } from "../utils/errorHandler";
import { NotFoundError } from "../errors/NotFoundError";

const service = new PedidoService();

function parseId(parte: string): number | null {
    const id = Number(parte);
    return isNaN(id) || id <= 0 ? null : id;
}

export async function routerPedido(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/").filter(Boolean);

    try {
        if (metodo === "GET" && partes.length === 1 && partes[0] === "pedidos") {
            const pedidos = await service.obtenerPedidos();
            sendJson(res, 200, { status: "success", data: pedidos });
            return;
        }

        if (metodo === "GET" && partes.length === 2 && partes[0] === "pedidos") {
            const id = parseId(partes[1]);
            if (!id) {
                sendJson(res, 400, { status: "fail", message: "ID inválido" });
                return;
            }
            const pedido = await service.obtenerPedidoPorId(id);
            if (!pedido) {
                throw new NotFoundError("El pedido no existe");
            }
            sendJson(res, 200, { status: "success", data: pedido });
            return;
        }

        if (metodo === "POST" && partes.length === 1 && partes[0] === "pedidos") {
            const body = await ReadBody(req);
            if (!body || body.trim() === "") {
                sendJson(res, 400, { status: "fail", message: "Body vacío" });
                return;
            }
            let p: unknown;
            try {
                p = JSON.parse(body);
            } catch {
                sendJson(res, 400, { status: "fail", message: "JSON inválido" });
                return;
            }
            const nuevo = await service.guardarPedido(p);
            sendJson(res, 201, { status: "success", message: "Pedido agregado", data: nuevo });
            return;
        }

        if (metodo === "PUT" && partes.length === 2 && partes[0] === "pedidos") {
            const id = parseId(partes[1]);
            if (!id) {
                sendJson(res, 400, { status: "fail", message: "ID inválido" });
                return;
            }
            const body = await ReadBody(req);
            if (!body || body.trim() === "") {
                sendJson(res, 400, { status: "fail", message: "Body vacío" });
                return;
            }
            let p: unknown;
            try {
                p = JSON.parse(body);
            } catch {
                sendJson(res, 400, { status: "fail", message: "JSON inválido" });
                return;
            }
            if (typeof p === "object" && p !== null) {
                (p as Record<string, unknown>).idPedido = id;
            }
            await service.actualizarPedido(p);
            sendJson(res, 200, { status: "success", message: "Pedido actualizado" });
            return;
        }

        if (metodo === "DELETE" && partes.length === 2 && partes[0] === "pedidos") {
            const id = parseId(partes[1]);
            if (!id) {
                sendJson(res, 400, { status: "fail", message: "ID inválido" });
                return;
            }
            await service.eliminarPedido(id);
            sendJson(res, 200, { status: "success", message: "Pedido eliminado" });
            return;
        }

        sendJson(res, 404, { status: "fail", message: "Ruta no encontrada" });

    } catch (error) {
        handleError(res, error);
    }
}