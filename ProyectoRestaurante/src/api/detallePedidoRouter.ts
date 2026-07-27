import { IncomingMessage, ServerResponse } from "http";
import { DetallePedidoService } from "../service/detallePedidoService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { handleError } from "../utils/errorHandler";
import { NotFoundError } from "../errors/NotFoundError";

const service = new DetallePedidoService();

export async function routerDetallePedido(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/detalles") {
            const detalles = await service.obtenerDetalles();
            sendJson(res, 200, { status: "success", data: detalles });
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "detalles") {
            const id = Number(partes[2]);
            const detalle = await service.obtenerDetallePorId(id);

            if (!detalle) {
                throw new NotFoundError("El detalle no existe");
            }

            sendJson(res, 200, { status: "success", data: detalle });
            return;
        }

        if (metodo === "GET" && partes.length === 4 && partes[1] === "pedidos" && partes[3] === "detalles") {
            const idPedido = Number(partes[2]);
            const detalles = await service.obtenerDetallesPorPedido(idPedido);
            sendJson(res, 200, { status: "success", data: detalles });
            return;
        }

        if (metodo === "POST" && url === "/detalles") {
            const body = await ReadBody(req);
            const d = JSON.parse(body);
            const nuevo = await service.guardarDetalle(d);
            sendJson(res, 201, { status: "success", message: "Detalle agregado", data: nuevo });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "detalles") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);
            const d = JSON.parse(body);
            d.idDetallePedido = id;
            await service.actualizarDetalle(d);
            sendJson(res, 200, { status: "success", message: "Detalle actualizado" });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "detalles") {
            const id = Number(partes[2]);
            await service.eliminarDetalle(id);
            sendJson(res, 200, { status: "success", message: "Detalle eliminado" });
            return;
        }

        sendJson(res, 404, { status: "fail", message: "Ruta no encontrada" });

    } catch (error) {
        handleError(res, error);
    }
}