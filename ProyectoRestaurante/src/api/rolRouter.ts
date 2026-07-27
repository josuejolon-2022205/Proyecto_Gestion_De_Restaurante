import { IncomingMessage, ServerResponse } from "http";
import { RolService } from "../service/rolService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { handleError } from "../utils/errorHandler";
import { NotFoundError } from "../errors/NotFoundError";

const service = new RolService();

export async function routerRol(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/roles") {
            const roles = await service.obtenerRoles();
            sendJson(res, 200, { status: "success", data: roles });
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "roles") {
            const id = Number(partes[2]);
            const rol = await service.obtenerRolPorId(id);

            if (!rol) {
                throw new NotFoundError("El rol no existe");
            }

            sendJson(res, 200, { status: "success", data: rol });
            return;
        }

        if (metodo === "POST" && url === "/roles") {
            const body = await ReadBody(req);
            const r = JSON.parse(body);
            const nuevo = await service.guardarRol(r);
            sendJson(res, 201, { status: "success", message: "Rol agregado", data: nuevo });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "roles") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);
            const r = JSON.parse(body);
            r.idRol = id;
            await service.actualizarRol(r);
            sendJson(res, 200, { status: "success", message: "Rol actualizado" });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "roles") {
            const id = Number(partes[2]);
            await service.eliminarRol(id);
            sendJson(res, 200, { status: "success", message: "Rol eliminado" });
            return;
        }

        sendJson(res, 404, { status: "fail", message: "Ruta no encontrada" });

    } catch (error) {
        handleError(res, error);
    }
}