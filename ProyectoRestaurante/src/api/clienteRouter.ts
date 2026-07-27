import { IncomingMessage, ServerResponse } from "http";
import { ClienteService } from "../service/clienteService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { handleError } from "../utils/errorHandler";
import { NotFoundError } from "../errors/NotFoundError";

const service = new ClienteService();

export async function clienteRouter(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/clientes") {
            const clientes = await service.obtenerClientes();
            sendJson(res, 200, { status: "success", data: clientes });
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "clientes") {
            const id = Number(partes[2]);
            const cliente = await service.obtenerClientePorId(id);

            if (!cliente) {
                throw new NotFoundError("El cliente no existe");
            }

            sendJson(res, 200, { status: "success", data: cliente });
            return;
        }

        if (metodo === "POST" && url === "/clientes") {
            const body = await ReadBody(req);
            const c = JSON.parse(body);
            const nuevo = await service.guardarCliente(c);
            sendJson(res, 201, { status: "success", message: "Cliente agregado", data: nuevo });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "clientes") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);
            const c = JSON.parse(body);
            c.idCliente = id;
            await service.actualizarCliente(c);
            sendJson(res, 200, { status: "success", message: "Cliente actualizado" });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "clientes") {
            const id = Number(partes[2]);
            await service.eliminarCliente(id);
            sendJson(res, 200, { status: "success", message: "Cliente eliminado" });
            return;
        }

        sendJson(res, 404, { status: "fail", message: "Ruta no encontrada" });

    } catch (error) {
        handleError(res, error);
    }
}