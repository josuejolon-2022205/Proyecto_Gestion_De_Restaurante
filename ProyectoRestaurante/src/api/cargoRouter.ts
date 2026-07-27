import { IncomingMessage, ServerResponse } from "http";
import { CargoService } from "../service/cargoService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { handleError } from "../utils/errorHandler";
import { NotFoundError } from "../errors/NotFoundError";

const service = new CargoService();

export async function routerCargo(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";

    try {
        if (metodo === "GET" && url === "/cargos") {
            const cargos = await service.obtenerCargos();
            sendJson(res, 200, { status: "success", data: cargos });
            return;
        }

        if (metodo === "GET" && url.startsWith("/cargos/")) {
            const id = Number(url.split("/")[2]);
            const cargo = await service.obtenerCargoPorId(id);

            if (!cargo) {
                throw new NotFoundError("Cargo no encontrado");
            }

            sendJson(res, 200, { status: "success", data: cargo });
            return;
        }

        if (metodo === "POST" && url === "/cargos") {
            const body = await ReadBody(req);
            const c = JSON.parse(body);
            const nuevo = await service.guardarCargo(c);
            sendJson(res, 201, { status: "success", message: "Cargo agregado", data: nuevo });
            return;
        }

        if (metodo === "PUT" && url.startsWith("/cargos/")) {
            const id = Number(url.split("/")[2]);
            const body = await ReadBody(req);
            const cargo = JSON.parse(body);
            cargo.idCargo = id;
            await service.actualizarCargo(cargo);
            sendJson(res, 200, { status: "success", message: "Cargo actualizado" });
            return;
        }

        if (metodo === "DELETE" && url.startsWith("/cargos/")) {
            const id = Number(url.split("/")[2]);
            await service.eliminarCargo(id);
            sendJson(res, 200, { status: "success", message: "Cargo eliminado" });
            return;
        }

        sendJson(res, 404, { status: "fail", message: "Ruta no encontrada" });

    } catch (error) {
        handleError(res, error);
    }
}