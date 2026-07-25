import { IncomingMessage, ServerResponse } from "http";
import { ProductoService } from "../service/productoService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { routeHandler } from "../utils/routeHandler";

const service = new ProductoService();

export async function routerProducto(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/productos") {
            sendJson(res, 200, await service.obtenerProductos());
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "productos") {
            const id = Number(partes[2]);
            const producto = await service.obtenerProductoPorId(id);

            if (!producto) {
                sendJson(res, 404, { error: "El id no existe" });
                return;
            }

            sendJson(res, 200, producto);
            return;
        }

        if (metodo === "POST" && url === "/productos") {
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const p = JSON.parse(body);
                await service.guardarProducto(p);
                sendJson(res, 201, { mensaje: "Producto agregado correctamente" });
            });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "productos") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const p = JSON.parse(body);
                p.idProducto = id;
                await service.actualizarProducto(p);
                sendJson(res, 200, { mensaje: "Producto actualizado" });
            });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "productos") {
            const id = Number(partes[2]);
            await service.eliminarProducto(id);
            sendJson(res, 200, { mensaje: "Producto eliminado" });
            return;
        }

        sendJson(res, 404, { error: "No se encontro la ruta" });

    } catch (error) {
        sendJson(res, 500, { error: (error as Error).message });
    }
}