import { ServerResponse } from "http";
import { withTryCatch } from "../utils/withTryCatch";
function _sendJson(res: ServerResponse, status: number, data: unknown): void {
    res.writeHead(status, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify(data));
}

export const sendJson = withTryCatch(
    _sendJson, undefined,"Error al enviar respuesta JSON."
);