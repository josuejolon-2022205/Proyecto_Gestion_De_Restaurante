import { IncomingMessage } from "http";

export function ReadBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        let body = "";
        req.setEncoding("utf-8");
        req.on("data", (chunk: string) => {
            body += chunk;
        });
        req.on("end", () => {
            resolve(body);
        });
        req.on("error", (err) => {
            reject(err);
        });
    });
}