import { IncomingMessage, ServerResponse } from "http";
import { CargoService } from "../service/cargoService";
import { ReadBody } from "./readBody";
import { sendJson } from "./sendJSON";
import { routeHandler } from "../utils/routeHandler";

const service = new CargoService();

export async function routerCargo(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");

  const url = req.url ?? "";
  const metodo = req.method ?? "";

  try {
    if (metodo === "GET" && url === "/cargos") {
        
      const cargos = await service.obtenerCargos();
      sendJson(res, 200, cargos);
      return;
    }

    if (metodo === "GET" && url.startsWith("/cargos/")) {

      const id = Number(url.split("/")[2]);
      const cargo = await service.obtenerCargoPorId(id);

      if (!cargo) {
        sendJson(res, 404, { mensaje: "Cargo no encontrado" });
        return;
      }

      sendJson(res, 200, cargo);
      return;
    }

    if (metodo === "POST" && url === "/cargos") {

      await routeHandler(res, async () => {
        const body = await ReadBody(req);
        const cargo = JSON.parse(body);
        await service.guardarCargo(cargo);
        sendJson(res, 201, { mensaje: "Cargo agregado correctamente" });
      });
      return;
    }

    if (metodo === "PUT" && url.startsWith("/cargos/")) {

      const id = Number(url.split("/")[2]);
      await routeHandler(res, async () => {
        const body = await ReadBody(req);
        const cargo = JSON.parse(body);
        cargo.id_cargo = id;
        await service.actualizarCargo(cargo);
        sendJson(res, 200, { mensaje: "Cargo actualizado" });
      });
      return;
    }

    if (metodo === "DELETE" && url.startsWith("/cargos/")) {

      const id = Number(url.split("/")[2]);
      await service.eliminarCargo(id);
      sendJson(res, 200, { mensaje: "Cargo eliminado" });
      return;
    }

    sendJson(res, 404, { mensaje: "Ruta no encontrada" });

  } catch (error) {
    sendJson(res, 500, { mensaje: (error as Error).message });
  }
}