import { IncomingMessage, ServerResponse } from "http";
import { FacturaService } from "../service/facturaService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { handleError } from "../utils/errorHandler";
import { NotFoundError } from "../errors/NotFoundError";

const service = new FacturaService();

export async function routerFactura(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";
    const partes = url.split("/");

    try {
        if (metodo === "GET" && url === "/facturas") {
            const facturas = await service.obtenerFacturas();
            sendJson(res, 200, { status: "success", data: facturas });
            return;
        }

        if (metodo === "GET" && partes.length === 3 && partes[1] === "facturas") {
            const id = Number(partes[2]);
            const factura = await service.obtenerFacturaPorId(id);

            if (!factura) {
                throw new NotFoundError("La factura no existe");
            }

            sendJson(res, 200, { status: "success", data: factura });
            return;
        }

        if (metodo === "POST" && url === "/facturas") {
            const body = await ReadBody(req);
            const f = JSON.parse(body);
            const nuevo = await service.guardarFactura(f);
            sendJson(res, 201, { status: "success", message: "Factura generada", data: nuevo });
            return;
        }

        if (metodo === "PUT" && partes.length === 3 && partes[1] === "facturas") {
            const id = Number(partes[2]);
            const body = await ReadBody(req);
            const f = JSON.parse(body);
            f.idFactura = id;
            await service.actualizarFactura(f);
            sendJson(res, 200, { status: "success", message: "Factura actualizada" });
            return;
        }

        if (metodo === "DELETE" && partes.length === 3 && partes[1] === "facturas") {
            const id = Number(partes[2]);
            await service.eliminarFactura(id);
            sendJson(res, 200, { status: "success", message: "Factura eliminada" });
            return;
        }

        sendJson(res, 404, { status: "fail", message: "Ruta no encontrada" });

    } catch (error) {
        handleError(res, error);
    }
}