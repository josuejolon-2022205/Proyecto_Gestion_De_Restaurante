import { ProductoIngrediente } from "../models/productoIngrediente";
import { withTryCatch } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class ProductoIngredienteRepository {

    private async _obtenerProductoIngredientes(): Promise<ProductoIngrediente[]> {
        const result = await conexion.query("select * from productoIngrediente");
        return result.rows;
    }

    private async _obtenerProductoIngredientePorId(id: number): Promise<ProductoIngrediente | undefined> {
        const result = await conexion.query("select * from productoIngrediente where idProductoIngrediente = $1", [id]);
        return result.rows[0];
    }

    private async _obtenerIngredientesPorProducto(idProducto: number): Promise<ProductoIngrediente[]> {
        const result = await conexion.query("select * from productoIngrediente where fkIdProducto = $1", [idProducto]);
        return result.rows;
    }

    private async _obtenerProductosPorIngrediente(idIngrediente: number): Promise<ProductoIngrediente[]> {
        const result = await conexion.query("select * from productoIngrediente where fkIdIngrediente = $1", [idIngrediente]);
        return result.rows;
    }

    private async _guardarProductoIngrediente(productoIngrediente: ProductoIngrediente): Promise<void> {
        await conexion.query(
            "insert into productoIngrediente (idProductoIngrediente, cantidadUtilizada, fkIdProducto, fkIdIngrediente) values ($1, $2, $3, $4)",
            [productoIngrediente.idProductoIngrediente, productoIngrediente.cantidadUtilizada, productoIngrediente.fkIdProducto, productoIngrediente.fkIdIngrediente]
        );
    }

    private async _actualizarProductoIngrediente(productoIngredienteActualizado: ProductoIngrediente): Promise<boolean> {
        const result = await conexion.query(
            "update productoIngrediente set cantidadUtilizada = $1, fkIdProducto = $2, fkIdIngrediente = $3 where idProductoIngrediente = $4",
            [productoIngredienteActualizado.cantidadUtilizada, productoIngredienteActualizado.fkIdProducto, productoIngredienteActualizado.fkIdIngrediente, productoIngredienteActualizado.idProductoIngrediente]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarProductoIngrediente(id: number): Promise<boolean> {
        const result = await conexion.query("delete from productoIngrediente where idProductoIngrediente = $1", [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerProductoIngredientes = withTryCatch(this._obtenerProductoIngredientes.bind(this), [], "Error al obtener producto ingredientes.");
    obtenerProductoIngredientePorId = withTryCatch(this._obtenerProductoIngredientePorId.bind(this), undefined, "Error al buscar producto ingrediente por ID.");
    obtenerIngredientesPorProducto = withTryCatch(this._obtenerIngredientesPorProducto.bind(this), [], "Error al buscar ingredientes por producto.");
    obtenerProductosPorIngrediente = withTryCatch(this._obtenerProductosPorIngrediente.bind(this), [], "Error al buscar productos por ingrediente.");
    guardarProductoIngrediente = withTryCatch(this._guardarProductoIngrediente.bind(this), undefined, "Error al guardar el producto ingrediente.");
    actualizarProductoIngrediente = withTryCatch(this._actualizarProductoIngrediente.bind(this), false, "Error al actualizar el producto ingrediente.");
    eliminarProductoIngrediente = withTryCatch(this._eliminarProductoIngrediente.bind(this), false, "Error al eliminar el producto ingrediente.");
}