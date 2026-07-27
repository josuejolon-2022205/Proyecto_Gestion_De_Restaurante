import { IncomingMessage, ServerResponse } from "http";
import { ProveedorService } from "../service/proveedorService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { handleError } from "../utils/errorHandler";
import { NotFoundError } from "../errors/NotFoundError";

const service = new ProveedorService();

export async function routerProveedor(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/proveedores") {
            const proveedores = await service.obtenerProveedores();
            sendJson(res, 200, { status: "success", data: proveedores });
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "proveedores") {
            const id = Number(partes[2]);
            const proveedor = await service.obtenerProveedorPorId(id);

            if (!proveedor) {
                throw new NotFoundError("El proveedor no existe");
            }

            sendJson(res, 200, { status: "success", data: proveedor });
            return;
        }

        if (metodo === "POST" && url === "/proveedores") {
            const body = await ReadBody(req);
            const p = JSON.parse(body);
            const nuevo = await service.guardarProveedor(p);
            sendJson(res, 201, { status: "success", message: "Proveedor agregado", data: nuevo });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "proveedores") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);
            const p = JSON.parse(body);
            p.idProveedor = id;
            await service.actualizarProveedor(p);
            sendJson(res, 200, { status: "success", message: "Proveedor actualizado" });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "proveedores") {
            const id = Number(partes[2]);
            await service.eliminarProveedor(id);
            sendJson(res, 200, { status: "success", message: "Proveedor eliminado" });
            return;
        }

        sendJson(res, 404, { status: "fail", message: "Ruta no encontrada" });

    } catch (error) {
        handleError(res, error);
    }
}