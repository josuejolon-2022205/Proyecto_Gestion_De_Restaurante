import { IncomingMessage, ServerResponse } from "http";
import { EmpleadoService } from "../service/EmpleadoService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { handleError } from "../utils/errorHandler";
import { NotFoundError } from "../errors/NotFoundError";

const service = new EmpleadoService();

function parseId(parte: string): number | null {
    const id = Number(parte);
    return isNaN(id) || id <= 0 ? null : id;
}

export async function routerEmpleado(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/").filter(Boolean); 

    try {
        if (metodo === "GET" && partes.length === 1 && partes[0] === "empleados") {
            const empleados = await service.obtenerEmpleados();
            sendJson(res, 200, { status: "success", data: empleados });
            return;
        }

        if (metodo === "GET" && partes.length === 2 && partes[0] === "empleados") {
            const id = parseId(partes[1]);
            if (!id) {
                sendJson(res, 400, { status: "fail", message: "ID inválido" });
                return;
            }
            const empleado = await service.obtenerEmpleadoPorId(id);
            if (!empleado) {
                throw new NotFoundError("El empleado no existe");
            }
            sendJson(res, 200, { status: "success", data: empleado });
            return;
        }

        if (metodo === "POST" && partes.length === 1 && partes[0] === "empleados") {
            const body = await ReadBody(req);
            if (!body || body.trim() === "") {
                sendJson(res, 400, { status: "fail", message: "Body vacío" });
                return;
            }
            let e: unknown;
            try {
                e = JSON.parse(body);
            } catch {
                sendJson(res, 400, { status: "fail", message: "JSON inválido en el body" });
                return;
            }
            const nuevo = await service.guardarEmpleado(e);
            sendJson(res, 201, { status: "success", message: "Empleado agregado", data: nuevo });
            return;
        }

        if (metodo === "PUT" && partes.length === 2 && partes[0] === "empleados") {
            const id = parseId(partes[1]);
            if (!id) {
                sendJson(res, 400, { status: "fail", message: "ID inválido" });
                return;
            }
            const body = await ReadBody(req);
            if (!body || body.trim() === "") {
                sendJson(res, 400, { status: "fail", message: "Body vacío" });
                return;
            }
            let e: unknown;
            try {
                e = JSON.parse(body);
            } catch {
                sendJson(res, 400, { status: "fail", message: "JSON inválido en el body" });
                return;
            }
            if (typeof e === "object" && e !== null) {
                (e as Record<string, unknown>).idEmpleado = id;
            }
            await service.actualizarEmpleado(e);
            sendJson(res, 200, { status: "success", message: "Empleado actualizado" });
            return;
        }

        if (metodo === "DELETE" && partes.length === 2 && partes[0] === "empleados") {
            const id = parseId(partes[1]);
            if (!id) {
                sendJson(res, 400, { status: "fail", message: "ID inválido" });
                return;
            }
            await service.eliminarEmpleado(id);
            sendJson(res, 200, { status: "success", message: "Empleado eliminado" });
            return;
        }

        sendJson(res, 404, { status: "fail", message: "Ruta no encontrada" });

    } catch (error) {
        handleError(res, error);
    }
}