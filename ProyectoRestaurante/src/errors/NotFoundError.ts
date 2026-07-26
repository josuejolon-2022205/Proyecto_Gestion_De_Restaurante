import { AppError } from "./AppError";

export class NotFoundError extends AppError {
    statusCode = 404;
    status = "fail";

    constructor(message: string = "Recurso no encontrado") {
        super(message);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}
