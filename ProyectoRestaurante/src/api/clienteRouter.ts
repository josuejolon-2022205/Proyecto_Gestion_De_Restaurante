import { IncomingMessage, ServerResponse } from "http";
import { ClienteService } from "../service/clienteService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { routeHandler } from "../utils/routeHandler";

const service = new ClienteService();

export async function clienteRouter(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/clientes") {
            sendJson(res, 200, await service.obtenerClientes());
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "clientes") {
            const id = Number(partes[2]);
            const cliente = await service.obtenerClientePorId(id);

            if (!cliente) {
                sendJson(res, 404, { error: "El id no existe" });
                return;
            }

            sendJson(res, 200, cliente);
            return;
        }

        if (metodo === "POST" && url === "/clientes") {
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const c = JSON.parse(body);
                await service.guardarCliente(c);
                sendJson(res, 201, { mensaje: "Cliente agregado correctamente" });
            });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "clientes") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const c = JSON.parse(body);
                c.idCliente = id;
                await service.actualizarCliente(c);
                sendJson(res, 200, { mensaje: "Cliente actualizado" });
            });
            return;
        }

        sendJson(res, 404, { error: "No se encontro la ruta" });

    } catch (error) {
        sendJson(res, 500, { error: (error as Error).message });
    }
}