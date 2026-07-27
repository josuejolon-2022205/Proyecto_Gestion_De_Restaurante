import { IncomingMessage, ServerResponse } from "http";
import { UsuarioService } from "../service/usuarioService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { handleError } from "../utils/errorHandler";
import { NotFoundError } from "../errors/NotFoundError";

const service = new UsuarioService();

export async function routerUsuario(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/usuarios") {
            const usuarios = await service.obtenerUsuarios();
            sendJson(res, 200, { status: "success", data: usuarios });
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "usuarios") {
            const id = Number(partes[2]);
            const usuario = await service.obtenerUsuarioPorId(id);

            if (!usuario) {
                throw new NotFoundError("El usuario no existe");
            }

            sendJson(res, 200, { status: "success", data: usuario });
            return;
        }

        if (metodo === "POST" && url === "/usuarios") {
            const body = await ReadBody(req);
            const u = JSON.parse(body);
            const nuevo = await service.guardarUsuario(u);
            sendJson(res, 201, { status: "success", message: "Usuario agregado", data: nuevo });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "usuarios") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);
            const u = JSON.parse(body);
            u.idUsuario = id;
            await service.actualizarUsuario(u);
            sendJson(res, 200, { status: "success", message: "Usuario actualizado" });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "usuarios") {
            const id = Number(partes[2]);
            await service.eliminarUsuario(id);
            sendJson(res, 200, { status: "success", message: "Usuario eliminado" });
            return;
        }

        sendJson(res, 404, { status: "fail", message: "Ruta no encontrada" });

    } catch (error) {
        handleError(res, error);
    }
}