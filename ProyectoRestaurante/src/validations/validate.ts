import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../errors/ValidationError";

export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
    try {
        return schema.parse(data);
    } catch (error) {
        if (error instanceof ZodError) {
            throw new ValidationError(error.issues);
        }
        throw error;
    }
}