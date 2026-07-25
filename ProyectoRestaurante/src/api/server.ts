import * as http from "http";
import { routerCargo } from "./cargoRouter";
import { routerEmpleado } from "./empleadoRouter";
import { routerIngrediente } from "./ingredienteRouter";
import { routerProductoIngrediente } from "./productoIngredienteRouter";
import { routerCategoriaProducto } from "./categoriaProductoRouter";
import { routerDetallePedido } from "./detallePedidoRouter";
import { clienteRouter } from "./clienteRouter";
import { routerUsuario } from "./usuarioRouter";
import { routerReserva } from "./reservaRouter";
import { routerFactura } from "./facturaRouter";
import { routerMovimientoInventario } from "./movimientoInventarioRouter";
import { routerProducto } from "./productoRouter";
import { routerRol } from "./rolRouter";
import { routerPedido } from "./pedidoRouter";
import { routerMesa } from "./mesaRouter";
import { routerProveedor } from "./proveedorRouter";
import { routerPago } from "./pagoRouter";

export const server = http.createServer(async (req, res) => {
    await routerCargo(req, res);
    if (res.headersSent) return;

    await routerEmpleado(req, res);
    if (res.headersSent) return;

    await routerIngrediente(req, res);
    if (res.headersSent) return;

    await routerProductoIngrediente(req, res);
    if (res.headersSent) return;

    await routerCategoriaProducto(req, res);
    if (res.headersSent) return;

    await routerDetallePedido(req, res);
    if (res.headersSent) return;

    await clienteRouter(req, res);
    if (res.headersSent) return;

    await routerUsuario(req, res);
    if (res.headersSent) return;

    await routerReserva(req, res);
    if (res.headersSent) return;

    await routerFactura(req, res);
    if (res.headersSent) return;

    await routerMovimientoInventario(req, res);
    if (res.headersSent) return;

    await routerProducto(req, res);
    if (res.headersSent) return;

    await routerRol(req, res);
    if (res.headersSent) return;

    await routerPedido(req, res);
    if (res.headersSent) return;

    await routerMesa(req, res);
    if (res.headersSent) return;

    await routerProveedor(req, res);
    if (res.headersSent) return;

    await routerPago(req, res);
    if (res.headersSent) return;

    // Si ningún router respondió, enviar 404 global
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "No se encontro la ruta" }));
});