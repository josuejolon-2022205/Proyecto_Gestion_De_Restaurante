import { IncomingMessage, ServerResponse } from "http";
import { UsuarioService } from "../service/usuarioService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { routeHandler } from "../utils/routeHandler";

const service = new UsuarioService();

export async function routerUsuario(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/usuarios") {
            sendJson(res, 200, await service.obtenerUsuarios());
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "usuarios") {
            const id = Number(partes[2]);
            const usuario = await service.obtenerUsuarioPorId(id);

            if (!usuario) {
                sendJson(res, 404, { error: "El id no existe" });
                return;
            }

            sendJson(res, 200, usuario);
            return;
        }

    if (metodo === "POST" && url === "/usuarios") {
        const body = await ReadBody(req);
        await routeHandler(res, async () => {
            const u = JSON.parse(body);
            const nuevo = await service.guardarUsuario(u);
            sendJson(res, 201, { mensaje: "Usuario agregado correctamente", usuario: nuevo });
        });
        return;
    }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "usuarios") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const u = JSON.parse(body);
                u.idUsuario = id;
                await service.actualizarUsuario(u);
                sendJson(res, 200, { mensaje: "Usuario actualizado" });
            });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "usuarios") {
            const id = Number(partes[2]);
            await service.eliminarUsuario(id);
            sendJson(res, 200, { mensaje: "Usuario eliminado" });
            return;
        }

        return

    } catch (error) {
        sendJson(res, 500, { error: (error as Error).message });
    }
}