import { AppError } from "./AppError";

export class ConflictError extends AppError {
    statusCode = 409;
    status = "fail";

    constructor(message: string = "Conflicto con el recurso") {
        super(message);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}