import { IncomingMessage, ServerResponse } from "http";
import { EmpleadoService } from "../service/EmpleadoService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { routeHandler } from "../utils/routeHandler";

const service = new EmpleadoService();

export async function routerEmpleado(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/empleados") {
            sendJson(res, 200, await service.obtenerEmpleados());
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "empleados") {
            const id = Number(partes[2]);
            const empleado = await service.obtenerEmpleadoPorId(id);

            if (!empleado) {
                sendJson(res, 404, { error: "El id no existe" });
                return;
            }

            sendJson(res, 200, empleado);
            return;
        }

        if (metodo === "POST" && url === "/empleados") {
            const body = await ReadBody(req);
            await routeHandler(res, async () => {
                const e = JSON.parse(body);
                const nuevo = await service.guardarEmpleado(e);
                sendJson(res, 201, { mensaje: "Empleado agregado correctamente", empleado: nuevo });
            });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "empleados") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);

            await routeHandler(res, async () => {
                const e = JSON.parse(body);
                e.idEmpleado = id;
                await service.actualizarEmpleado(e);
                sendJson(res, 200, { mensaje: "Empleado actualizado" });
            });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "empleados") {
            const id = Number(partes[2]);
            await service.eliminarEmpleado(id);
            sendJson(res, 200, { mensaje: "Empleado eliminado" });
            return;
        }

        return

    } catch (error) {
        sendJson(res, 500, { error: (error as Error).message });
    }
}