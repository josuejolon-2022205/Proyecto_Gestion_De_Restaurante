import { IncomingMessage, ServerResponse } from "http";
import { CategoriaProductoService } from "../service/categoriaProductoService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { handleError } from "../utils/errorHandler";
import { NotFoundError } from "../errors/NotFoundError";

const service = new CategoriaProductoService();

export async function routerCategoriaProducto(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/categorias") {
            const categorias = await service.obtenerCategorias();
            sendJson(res, 200, { status: "success", data: categorias });
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "categorias") {
            const id = Number(partes[2]);
            const categoria = await service.obtenerCategoriaPorId(id);

            if (!categoria) {
                throw new NotFoundError("La categoría no existe");
            }

            sendJson(res, 200, { status: "success", data: categoria });
            return;
        }

        if (metodo === "POST" && url === "/categorias") {
            const body = await ReadBody(req);
            const c = JSON.parse(body);
            const nuevo = await service.guardarCategoria(c);
            sendJson(res, 201, { status: "success", message: "Categoría agregada", data: nuevo });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "categorias") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);
            const c = JSON.parse(body);
            c.idCategoriaProducto = id;
            await service.actualizarCategoria(c);
            sendJson(res, 200, { status: "success", message: "Categoría actualizada" });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "categorias") {
            const id = Number(partes[2]);
            await service.eliminarCategoria(id);
            sendJson(res, 200, { status: "success", message: "Categoría eliminada" });
            return;
        }

        sendJson(res, 404, { status: "fail", message: "Ruta no encontrada" });

    } catch (error) {
        handleError(res, error);
    }
}