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
import { sendJson } from "./sendJSON";

export const server = http.createServer(async (req, res) => {
    const url = req.url ?? "";

    if (url.startsWith("/cargos")) {
        await routerCargo(req, res);
        return;
    }

    if (url.startsWith("/empleados")) {
        await routerEmpleado(req, res);
        return;
    }

    if (url.startsWith("/ingredientes")) {
        await routerIngrediente(req, res);
        return;
    }

    if (url.startsWith("/productoIngredientes")) {
        await routerProductoIngrediente(req, res);
        return;
    }

    if (url.startsWith("/categorias")) {
        await routerCategoriaProducto(req, res);
        return;
    }

    if (url.startsWith("/detalles")) {
        await routerDetallePedido(req, res);
        return;
    }

    if (url.startsWith("/clientes")) {
        await clienteRouter(req, res);
        return;
    }

    if (url.startsWith("/usuarios")) {
        await routerUsuario(req, res);
        return;
    }

    if (url.startsWith("/reservas")) {
        await routerReserva(req, res);
        return;
    }

    if (url.startsWith("/facturas")) {
        await routerFactura(req, res);
        return;
    }

    if (url.startsWith("/movimientos")) {
        await routerMovimientoInventario(req, res);
        return;
    }

    if (url.startsWith("/productos")) {
        await routerProducto(req, res);
        return;
    }

    if (url.startsWith("/roles")) {
        await routerRol(req, res);
        return;
    }

    if (url.startsWith("/pedidos")) {
        await routerPedido(req, res);
        return;
    }

    if (url.startsWith("/mesas")) {
        await routerMesa(req, res);
        return;
    }

    if (url.startsWith("/proveedores")) {
        await routerProveedor(req, res);
        return;
    }

    if (url.startsWith("/pagos")) {
        await routerPago(req, res);
        return;
    }

    sendJson(res, 404, { error: "Ruta no encontrada" });
});