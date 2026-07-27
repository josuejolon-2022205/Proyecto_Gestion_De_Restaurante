import { IncomingMessage, ServerResponse } from "http";
import { MesaService } from "../service/mesaService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { handleError } from "../utils/errorHandler";
import { NotFoundError } from "../errors/NotFoundError";

const service = new MesaService();

export async function routerMesa(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/mesas") {
            const mesas = await service.obtenerMesas();
            sendJson(res, 200, { status: "success", data: mesas });
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "mesas") {
            const id = Number(partes[2]);
            const mesa = await service.obtenerMesaPorId(id);

            if (!mesa) {
                throw new NotFoundError("La mesa no existe");
            }

            sendJson(res, 200, { status: "success", data: mesa });
            return;
        }

        if (metodo === "POST" && url === "/mesas") {
            const body = await ReadBody(req);
            const m = JSON.parse(body);
            const nuevo = await service.guardarMesa(m);
            sendJson(res, 201, { status: "success", message: "Mesa agregada", data: nuevo });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "mesas") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);
            const m = JSON.parse(body);
            m.idMesa = id;
            await service.actualizarMesa(m);
            sendJson(res, 200, { status: "success", message: "Mesa actualizada" });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "mesas") {
            const id = Number(partes[2]);
            await service.eliminarMesa(id);
            sendJson(res, 200, { status: "success", message: "Mesa eliminada" });
            return;
        }

        sendJson(res, 404, { status: "fail", message: "Ruta no encontrada" });

    } catch (error) {
        handleError(res, error);
    }
}