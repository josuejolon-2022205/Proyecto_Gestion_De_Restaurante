import { IncomingMessage } from "http";
import { withTryCatch } from "../utils/withTryCatch"

export const ReadBody = withTryCatch(
    async (req: IncomingMessage): Promise<string> => {
        return new Promise((resolve, reject) => {
            let body = "";
            req.on("data", (chunk) => { body += chunk; });
            req.on("end", () => { resolve(body); });
            req.on("error", reject);
        });
    },
    "",
    "Error al leer el body de la petición."
);