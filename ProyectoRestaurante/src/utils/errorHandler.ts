import { ServerResponse } from "http";
import { AppError } from "../errors/AppError";
import { ValidationError } from "../errors/ValidationError";
import { NotFoundError } from "../errors/NotFoundError";
import { ConflictError } from "../errors/ConflictError";
import { DatabaseError } from "../errors/DatabaseError";
import { sendJson } from "../api/sendJSON";

export function handleError(res: ServerResponse, error: unknown): void {
    if (error instanceof ValidationError) {
        sendJson(res, 400, { status: "fail", errors: error.serializeErrors() });
        return;
    }
    if (error instanceof NotFoundError) {
        sendJson(res, 404, { status: "fail", errors: error.serializeErrors() });
        return;
    }
    if (error instanceof ConflictError) {
        sendJson(res, 409, { status: "fail", errors: error.serializeErrors() });
        return;
    }
    if (error instanceof DatabaseError) {
        sendJson(res, 500, { status: "error", errors: error.serializeErrors() });
        return;
    }
    if (error instanceof AppError) {
        sendJson(res, error.statusCode, { status: error.status, errors: error.serializeErrors() });
        return;
    }
    console.error("Error no controlado:", error);
    sendJson(res, 500, { status: "error", message: "Error interno del servidor" });
}