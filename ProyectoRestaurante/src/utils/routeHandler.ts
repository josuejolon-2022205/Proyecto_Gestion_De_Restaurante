import { ServerResponse } from "http";
import { sendJson } from "../api/sendJSON";

export async function routeHandler(
  res: ServerResponse,
  fn: () => Promise<void>,
  errorStatus: number = 400
): Promise<void> {
  try {
    await fn();
  } catch (error) {
    sendJson(res, errorStatus, { mensaje: (error as Error).message });
  }
}