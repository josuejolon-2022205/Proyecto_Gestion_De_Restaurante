import { IncomingMessage, ServerResponse } from "http";
import { ProductoIngredienteService } from "../service/productoIngredienteService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { handleError } from "../utils/errorHandler";
import { NotFoundError } from "../errors/NotFoundError";

const service = new ProductoIngredienteService();

export async function routerProductoIngrediente(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/productoIngredientes") {
            const pis = await service.obtenerProductoIngredientes();
            sendJson(res, 200, { status: "success", data: pis });
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "productoIngredientes") {
            const id = Number(partes[2]);
            const pi = await service.obtenerProductoIngredientePorId(id);

            if (!pi) {
                throw new NotFoundError("El producto ingrediente no existe");
            }

            sendJson(res, 200, { status: "success", data: pi });
            return;
        }

        if (metodo === "POST" && url === "/productoIngredientes") {
            const body = await ReadBody(req);
            const pi = JSON.parse(body);
            const nuevo = await service.guardarProductoIngrediente(pi);
            sendJson(res, 201, { status: "success", message: "Producto ingrediente agregado", data: nuevo });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "productoIngredientes") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);
            const pi = JSON.parse(body);
            pi.idProductoIngrediente = id;
            await service.actualizarProductoIngrediente(pi);
            sendJson(res, 200, { status: "success", message: "Producto ingrediente actualizado" });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "productoIngredientes") {
            const id = Number(partes[2]);
            await service.eliminarProductoIngrediente(id);
            sendJson(res, 200, { status: "success", message: "Producto ingrediente eliminado" });
            return;
        }

        sendJson(res, 404, { status: "fail", message: "Ruta no encontrada" });

    } catch (error) {
        handleError(res, error);
    }
}