import { Producto } from "../models/Producto";
import { withTryCatch, withTryCatchThrow } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class ProductoRepository {

    private async _obtenerProductos(): Promise<Producto[]> {
        const result = await conexion.query('select * from "producto"');
        return result.rows;
    }

    private async _obtenerProductoPorId(id: number): Promise<Producto | undefined> {
        const result = await conexion.query('select * from "producto" where "idProducto" = $1', [id]);
        return result.rows[0];
    }

    private async _obtenerProductosPorCategoria(idCategoria: number): Promise<Producto[]> {
        const result = await conexion.query('select * from "producto" where "fkIdCategoria" = $1', [idCategoria]);
        return result.rows;
    }

    private async _guardarProducto(producto: Omit<Producto, "idProducto">): Promise<Producto> {
        const result = await conexion.query(
            'insert into "producto" ("nombreProducto", "descripcionProducto", "precio", "disponibilidad", "fkIdCategoria") values ($1, $2, $3, $4, $5) returning "idProducto"',
            [producto.nombreProducto, producto.descripcionProducto, producto.precio, producto.disponibilidad, producto.fkIdCategoria]
        );
        if (!result.rows[0]) throw new Error("No se pudo obtener el id del producto insertado");
        return { ...producto, idProducto: result.rows[0].idProducto };
    }


    private async _actualizarProducto(productoActualizado: Producto): Promise<boolean> {
        const result = await conexion.query(
            'update "producto" set "nombreProducto" = $1, "descripcionProducto" = $2, "precio" = $3, "disponibilidad" = $4, "fkIdCategoria" = $5 where "idProducto" = $6',
            [productoActualizado.nombreProducto, productoActualizado.descripcionProducto, productoActualizado.precio, productoActualizado.disponibilidad, productoActualizado.fkIdCategoria, productoActualizado.idProducto]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarProducto(id: number): Promise<boolean> {
        const result = await conexion.query('delete from "producto" where "idProducto" = $1', [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerProductos = withTryCatch(this._obtenerProductos.bind(this), [], "Error al obtener productos.");
    obtenerProductoPorId = withTryCatch(this._obtenerProductoPorId.bind(this), undefined, "Error al buscar producto por ID.");
    obtenerProductosPorCategoria = withTryCatch(this._obtenerProductosPorCategoria.bind(this), [], "Error al buscar productos por categoría.");
    guardarProducto = withTryCatchThrow(this._guardarProducto.bind(this), "Error al guardar el producto.");
    actualizarProducto = withTryCatchThrow(this._actualizarProducto.bind(this), "Error al actualizar el producto.");
    eliminarProducto = withTryCatchThrow(this._eliminarProducto.bind(this), "Error al eliminar el producto.");
}