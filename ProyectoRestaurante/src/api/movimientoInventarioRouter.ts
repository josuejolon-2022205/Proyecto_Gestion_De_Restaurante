import { IncomingMessage, ServerResponse } from "http";
import { MovimientoInventarioService } from "../service/movimientoInventarioService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { handleError } from "../utils/errorHandler";
import { NotFoundError } from "../errors/NotFoundError";

const service = new MovimientoInventarioService();

function parseId(parte: string): number | null {
    const id = Number(parte);
    return isNaN(id) || id <= 0 ? null : id;
}

export async function routerMovimientoInventario(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/").filter(Boolean);

    try {
        if (metodo === "GET" && partes.length === 1 && partes[0] === "movimientos") {
            const movimientos = await service.obtenerMovimientos();
            sendJson(res, 200, { status: "success", data: movimientos });
            return;
        }

        if (metodo === "GET" && partes.length === 2 && partes[0] === "movimientos") {
            const id = parseId(partes[1]);
            if (!id) {
                sendJson(res, 400, { status: "fail", message: "ID inválido" });
                return;
            }
            const movimiento = await service.obtenerMovimientoPorId(id);
            if (!movimiento) {
                throw new NotFoundError("El movimiento no existe");
            }
            sendJson(res, 200, { status: "success", data: movimiento });
            return;
        }

        if (metodo === "POST" && partes.length === 1 && partes[0] === "movimientos") {
            const body = await ReadBody(req);
            if (!body || body.trim() === "") {
                sendJson(res, 400, { status: "fail", message: "Body vacío" });
                return;
            }
            let m: unknown;
            try {
                m = JSON.parse(body);
            } catch {
                sendJson(res, 400, { status: "fail", message: "JSON inválido" });
                return;
            }
            const nuevo = await service.guardarMovimiento(m);
            sendJson(res, 201, { status: "success", message: "Movimiento agregado", data: nuevo });
            return;
        }

        if (metodo === "PUT" && partes.length === 2 && partes[0] === "movimientos") {
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
            let m: unknown;
            try {
                m = JSON.parse(body);
            } catch {
                sendJson(res, 400, { status: "fail", message: "JSON inválido" });
                return;
            }
            if (typeof m === "object" && m !== null) {
                (m as Record<string, unknown>).idMovimiento = id;
            }
            await service.actualizarMovimiento(m);
            sendJson(res, 200, { status: "success", message: "Movimiento actualizado" });
            return;
        }

        if (metodo === "DELETE" && partes.length === 2 && partes[0] === "movimientos") {
            const id = parseId(partes[1]);
            if (!id) {
                sendJson(res, 400, { status: "fail", message: "ID inválido" });
                return;
            }
            await service.eliminarMovimiento(id);
            sendJson(res, 200, { status: "success", message: "Movimiento eliminado" });
            return;
        }

        sendJson(res, 404, { status: "fail", message: "Ruta no encontrada" });

    } catch (error) {
        handleError(res, error);
    }
}