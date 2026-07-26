import { AppError } from "./AppError";

export class DatabaseError extends AppError {
    statusCode = 500;
    status = "error";

    constructor(message: string = "Error interno de base de datos") {
        super(message);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}