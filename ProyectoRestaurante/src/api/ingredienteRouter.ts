import { IncomingMessage, ServerResponse } from "http";
import { IngredienteService } from "../service/IngredienteService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { routeHandler } from "../utils/routeHandler";

const service = new IngredienteService();

export async function routerIngrediente(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/ingredientes") {
            sendJson(res, 200, await service.obtenerIngredientes());
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "ingredientes") {
            const id = Number(partes[2]);
            const ingrediente = await service.obtenerIngredientePorId(id);

            if (!ingrediente) {
                sendJson(res, 404, { error: "El id no existe" });
                return;
            }

            sendJson(res, 200, ingrediente);
            return;
        }

        if (metodo === "POST" && url === "/ingredientes") {
            const body = await ReadBody(req);
            await routeHandler(res, async () => {
                const i = JSON.parse(body);
                const nuevo = await service.guardarIngrediente(i);
                sendJson(res, 201, { mensaje: "Ingrediente agregado correctamente", ingrediente: nuevo });
            });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "ingredientes") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const i = JSON.parse(body);
                i.idIngrediente = id;
                await service.actualizarIngrediente(i);
                sendJson(res, 200, { mensaje: "Ingrediente actualizado" });
            });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "ingredientes") {
            const id = Number(partes[2]);
            await service.eliminarIngrediente(id);
            sendJson(res, 200, { mensaje: "Ingrediente eliminado" });
            return;
        }

        return

    } catch (error) {
        sendJson(res, 500, { error: (error as Error).message });
    }
}