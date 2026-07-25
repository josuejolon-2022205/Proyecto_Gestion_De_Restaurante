import { IncomingMessage, ServerResponse } from "http";
import { ProductoIngredienteService } from "../service/productoIngredienteService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { routeHandler } from "../utils/routeHandler";

const service = new ProductoIngredienteService();

export async function routerProductoIngrediente(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/productoingredientes") {
            sendJson(res, 200, await service.obtenerProductoIngredientes());
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "productoingredientes") {
            const id = Number(partes[2]);
            const pi = await service.obtenerProductoIngredientePorId(id);

            if (!pi) {
                sendJson(res, 404, { error: "El id no existe" });
                return;
            }

            sendJson(res, 200, pi);
            return;
        }

        if (metodo === "POST" && url === "/productoingredientes") {
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const pi = JSON.parse(body);
                await service.guardarProductoIngrediente(pi);
                sendJson(res, 201, { mensaje: "ProductoIngrediente agregado correctamente" });
            });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "productoingredientes") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const pi = JSON.parse(body);
                pi.idProductoIngrediente = id;
                await service.actualizarProductoIngrediente(pi);
                sendJson(res, 200, { mensaje: "ProductoIngrediente actualizado" });
            });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "productoingredientes") {
            const id = Number(partes[2]);
            await service.eliminarProductoIngrediente(id);
            sendJson(res, 200, { mensaje: "ProductoIngrediente eliminado" });
            return;
        }

        return 

    } catch (error) {
        sendJson(res, 500, { error: (error as Error).message });
    }
}