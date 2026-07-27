import { IncomingMessage, ServerResponse } from "http";
import { ProductoService } from "../service/productoService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { handleError } from "../utils/errorHandler";
import { NotFoundError } from "../errors/NotFoundError";

const service = new ProductoService();

export async function routerProducto(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/productos") {
            const productos = await service.obtenerProductos();
            sendJson(res, 200, { status: "success", data: productos });
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "productos") {
            const id = Number(partes[2]);
            const producto = await service.obtenerProductoPorId(id);

            if (!producto) {
                throw new NotFoundError("El producto no existe");
            }

            sendJson(res, 200, { status: "success", data: producto });
            return;
        }

        if (metodo === "POST" && url === "/productos") {
            const body = await ReadBody(req);
            const p = JSON.parse(body);
            const nuevo = await service.guardarProducto(p);
            sendJson(res, 201, { status: "success", message: "Producto agregado", data: nuevo });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "productos") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);
            const p = JSON.parse(body);
            p.idProducto = id;
            await service.actualizarProducto(p);
            sendJson(res, 200, { status: "success", message: "Producto actualizado" });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "productos") {
            const id = Number(partes[2]);
            await service.eliminarProducto(id);
            sendJson(res, 200, { status: "success", message: "Producto eliminado" });
            return;
        }

        sendJson(res, 404, { status: "fail", message: "Ruta no encontrada" });

    } catch (error) {
        handleError(res, error);
    }
}