import { IncomingMessage, ServerResponse } from "http";
import { CategoriaProductoService } from "../service/categoriaProductoService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { routeHandler } from "../utils/routeHandler";

const service = new CategoriaProductoService();

export async function routerCategoriaProducto(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/categorias") {
            sendJson(res, 200, await service.obtenerCategorias());
            return;
        }

        if (metodo === "POST" && url === "/categorias") {
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const c = JSON.parse(body);
                await service.guardarCategoria(c);
                sendJson(res, 201, { mensaje: "Categoria agregada correctamente" });
            });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "categorias") {
            const id = Number(partes[2]);
            await service.eliminarCategoria(id);
            sendJson(res, 200, { mensaje: "Categoria eliminada" });
            return;
        }

        return

    } catch (error) {
        sendJson(res, 500, { error: (error as Error).message });
    }
}