import { IncomingMessage, ServerResponse } from "http";
import { ProveedorService } from "../service/proveedorService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { routeHandler } from "../utils/routeHandler";

const service = new ProveedorService();

export async function routerProveedor(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/proveedores") {
            sendJson(res, 200, await service.obtenerProveedores());
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "proveedores") {
            const id = Number(partes[2]);
            const proveedor = await service.obtenerProveedorPorId(id);

            if (!proveedor) {
                sendJson(res, 404, { error: "El id no existe" });
                return;
            }

            sendJson(res, 200, proveedor);
            return;
        }

        if (metodo === "POST" && url === "/proveedores") {
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const p = JSON.parse(body);
                await service.guardarProveedor(p);
                sendJson(res, 201, { mensaje: "Proveedor agregado correctamente" });
            });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "proveedores") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const p = JSON.parse(body);
                p.idProveedor = id;
                await service.actualizarProveedor(p);
                sendJson(res, 200, { mensaje: "Proveedor actualizado" });
            });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "proveedores") {
            const id = Number(partes[2]);
            await service.eliminarProveedor(id);
            sendJson(res, 200, { mensaje: "Proveedor eliminado" });
            return;
        }

        return

    } catch (error) {
        sendJson(res, 500, { error: (error as Error).message });
    }
}