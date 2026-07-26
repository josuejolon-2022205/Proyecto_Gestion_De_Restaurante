import { ProductoIngrediente } from "../models/productoIngrediente";
import { withTryCatch, withTryCatchThrow } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class ProductoIngredienteRepository {

    private async _obtenerProductoIngredientes(): Promise<ProductoIngrediente[]> {
        const result = await conexion.query('select * from "productoIngrediente"');
        return result.rows;
    }

    private async _obtenerProductoIngredientePorId(id: number): Promise<ProductoIngrediente | undefined> {
        const result = await conexion.query('select * from "productoIngrediente" where "idProductoIngrediente" = $1', [id]);
        return result.rows[0];
    }

    private async _obtenerIngredientesPorProducto(idProducto: number): Promise<ProductoIngrediente[]> {
        const result = await conexion.query('select * from "productoIngrediente" where "fkIdProducto" = $1', [idProducto]);
        return result.rows;
    }

    private async _obtenerProductosPorIngrediente(idIngrediente: number): Promise<ProductoIngrediente[]> {
        const result = await conexion.query('select * from "productoIngrediente" where "fkIdIngrediente" = $1', [idIngrediente]);
        return result.rows;
    }

    private async _guardarProductoIngrediente(pi: Omit<ProductoIngrediente, "idProductoIngrediente">): Promise<ProductoIngrediente> {
        const result = await conexion.query(
            'insert into "productoIngrediente" ("cantidadUtilizada", "fkIdProducto", "fkIdIngrediente") values ($1, $2, $3) returning "idProductoIngrediente"',
            [pi.cantidadUtilizada, pi.fkIdProducto, pi.fkIdIngrediente]
        );
        if (!result.rows[0]) throw new Error("No se pudo obtener el id del productoIngrediente insertado");
        return { ...pi, idProductoIngrediente: result.rows[0].idProductoIngrediente };
    }
    private async _actualizarProductoIngrediente(productoIngredienteActualizado: ProductoIngrediente): Promise<boolean> {
        const result = await conexion.query(
            'update "productoIngrediente" set "cantidadUtilizada" = $1, "fkIdProducto" = $2, "fkIdIngrediente" = $3 where "idProductoIngrediente" = $4',
            [productoIngredienteActualizado.cantidadUtilizada, productoIngredienteActualizado.fkIdProducto, productoIngredienteActualizado.fkIdIngrediente, productoIngredienteActualizado.idProductoIngrediente]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarProductoIngrediente(id: number): Promise<boolean> {
        const result = await conexion.query('delete from "productoIngrediente" where "idProductoIngrediente" = $1', [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerProductoIngredientes = withTryCatch(this._obtenerProductoIngredientes.bind(this), [], "Error al obtener producto ingredientes.");
    obtenerProductoIngredientePorId = withTryCatch(this._obtenerProductoIngredientePorId.bind(this), undefined, "Error al buscar producto ingrediente por ID.");
    obtenerIngredientesPorProducto = withTryCatch(this._obtenerIngredientesPorProducto.bind(this), [], "Error al buscar ingredientes por producto.");
    obtenerProductosPorIngrediente = withTryCatch(this._obtenerProductosPorIngrediente.bind(this), [], "Error al buscar productos por ingrediente.");
    guardarProductoIngrediente = withTryCatchThrow(this._guardarProductoIngrediente.bind(this), "Error al guardar el productoIngrediente.");
    actualizarProductoIngrediente = withTryCatchThrow(this._actualizarProductoIngrediente.bind(this), "Error al actualizar el productoIngrediente.");
    eliminarProductoIngrediente = withTryCatchThrow(this._eliminarProductoIngrediente.bind(this), "Error al eliminar el productoIngrediente.");
}