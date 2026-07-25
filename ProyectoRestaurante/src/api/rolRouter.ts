import { IncomingMessage, ServerResponse } from "http";
import { RolService } from "../service/rolService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { routeHandler } from "../utils/routeHandler";

const service = new RolService();

export async function routerRol(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/roles") {
            sendJson(res, 200, await service.obtenerRoles());
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "roles") {
            const id = Number(partes[2]);
            const rol = await service.obtenerRolPorId(id);

            if (!rol) {
                sendJson(res, 404, { error: "El id no existe" });
                return;
            }

            sendJson(res, 200, rol);
            return;
        }

        if (metodo === "POST" && url === "/roles") {
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const r = JSON.parse(body);
                await service.guardarRol(r);
                sendJson(res, 201, { mensaje: "Rol agregado correctamente" });
            });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "roles") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const r = JSON.parse(body);
                r.idRol = id;
                await service.actualizarRol(r);
                sendJson(res, 200, { mensaje: "Rol actualizado" });
            });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "roles") {
            const id = Number(partes[2]);
            await service.eliminarRol(id);
            sendJson(res, 200, { mensaje: "Rol eliminado" });
            return;
        }

        return 

    } catch (error) {
        sendJson(res, 500, { error: (error as Error).message });
    }
}