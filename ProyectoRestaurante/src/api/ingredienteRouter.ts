import { IncomingMessage, ServerResponse } from "http";
import { IngredienteService } from "../service/IngredienteService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { handleError } from "../utils/errorHandler";
import { NotFoundError } from "../errors/NotFoundError";

const service = new IngredienteService();

function parseId(parte: string): number | null {
    const id = Number(parte);
    return isNaN(id) || id <= 0 ? null : id;
}

export async function routerIngrediente(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/").filter(Boolean);

    try {
        // GET /ingredientes
        if (metodo === "GET" && partes.length === 1 && partes[0] === "ingredientes") {
            const ingredientes = await service.obtenerIngredientes();
            sendJson(res, 200, { status: "success", data: ingredientes });
            return;
        }

        if (metodo === "GET" && partes.length === 2 && partes[0] === "ingredientes") {
            const id = parseId(partes[1]);
            if (!id) {
                sendJson(res, 400, { status: "fail", message: "ID inválido" });
                return;
            }
            const ingrediente = await service.obtenerIngredientePorId(id);
            if (!ingrediente) {
                throw new NotFoundError("El ingrediente no existe");
            }
            sendJson(res, 200, { status: "success", data: ingrediente });
            return;
        }

        if (metodo === "POST" && partes.length === 1 && partes[0] === "ingredientes") {
            const body = await ReadBody(req);
            if (!body || body.trim() === "") {
                sendJson(res, 400, { status: "fail", message: "Body vacío" });
                return;
            }
            let i: unknown;
            try {
                 i= JSON.parse(body);
            } catch {
                sendJson(res, 400, { status: "fail", message: "JSON inválido" });
                return;
            }
            const nuevo = await service.guardarIngrediente(i);
            sendJson(res, 201, { status: "success", message: "Ingrediente agregado", data: nuevo });
            return;
        }

        if (metodo === "PUT" && partes.length === 2 && partes[0] === "ingredientes") {
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
            let i: unknown;
            try {
                i = JSON.parse(body);
            } catch {
                sendJson(res, 400, { status: "fail", message: "JSON inválido" });
                return;
            }
            if (typeof i === "object" && i !== null) {
                (i as Record<string, unknown>).idIngrediente = id;
            }
            await service.actualizarIngrediente(i);
            sendJson(res, 200, { status: "success", message: "Ingrediente actualizado" });
            return;
        }

        if (metodo === "DELETE" && partes.length === 2 && partes[0] === "ingredientes") {
            const id = parseId(partes[1]);
            if (!id) {
                sendJson(res, 400, { status: "fail", message: "ID inválido" });
                return;
            }
            await service.eliminarIngrediente(id);
            sendJson(res, 200, { status: "success", message: "Ingrediente eliminado" });
            return;
        }

        sendJson(res, 404, { status: "fail", message: "Ruta no encontrada" });

    } catch (error) {
        handleError(res, error);
    }
}