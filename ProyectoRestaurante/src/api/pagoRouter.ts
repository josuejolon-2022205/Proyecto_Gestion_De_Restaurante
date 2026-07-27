import { IncomingMessage, ServerResponse } from "http";
import { PagoService } from "../service/pagoService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { handleError } from "../utils/errorHandler";
import { NotFoundError } from "../errors/NotFoundError";

const service = new PagoService();

export async function routerPago(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/pagos") {
            const pagos = await service.obtenerPagos();
            sendJson(res, 200, { status: "success", data: pagos });
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "pagos") {
            const id = Number(partes[2]);
            const pago = await service.obtenerPagoPorId(id);

            if (!pago) {
                throw new NotFoundError("El pago no existe");
            }

            sendJson(res, 200, { status: "success", data: pago });
            return;
        }

        if (metodo === "POST" && url === "/pagos") {
            const body = await ReadBody(req);
            const p = JSON.parse(body);
            const nuevo = await service.guardarPago(p);
            sendJson(res, 201, { status: "success", message: "Pago agregado", data: nuevo });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "pagos") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);
            const p = JSON.parse(body);
            p.idPago = id;
            await service.actualizarPago(p);
            sendJson(res, 200, { status: "success", message: "Pago actualizado" });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "pagos") {
            const id = Number(partes[2]);
            await service.eliminarPago(id);
            sendJson(res, 200, { status: "success", message: "Pago eliminado" });
            return;
        }

        sendJson(res, 404, { status: "fail", message: "Ruta no encontrada" });

    } catch (error) {
        handleError(res, error);
    }
}