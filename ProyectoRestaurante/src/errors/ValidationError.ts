import { AppError } from "./AppError";
import { ZodIssue } from "zod";

export class ValidationError extends AppError {
    statusCode = 400;
    status = "fail";
    issues: ZodIssue[];

    constructor(issues: ZodIssue[]) {
        super("Error de validación");
        this.issues = issues;
    }

    serializeErrors() {
        return this.issues.map((issue) => ({
            message: issue.message,
            field: issue.path.join("."),
        }));
    }
}