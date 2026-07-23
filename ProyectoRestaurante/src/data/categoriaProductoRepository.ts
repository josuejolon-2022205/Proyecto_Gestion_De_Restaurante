import { CategoriaProducto } from "../models/CategoriaProducto";
import { withTryCatch } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class CategoriaProductoRepository {

    private async _obtenerCategorias(): Promise<CategoriaProducto[]> {
        const result = await conexion.query("SELECT * FROM categoriaProducto");
        return result.rows;
    }

    private async _obtenerCategoriaPorId(id: number): Promise<CategoriaProducto | undefined> {
        const result = await conexion.query("SELECT * FROM categoriaProducto WHERE idCategoriaProducto = $1", [id]);
        return result.rows[0];
    }

    private async _obtenerCategoriaPorNombre(nombre: string): Promise<CategoriaProducto | undefined> {
        const result = await conexion.query("SELECT * FROM categoriaProducto WHERE nombreCategoria = $1", [nombre]);
        return result.rows[0];
    }

    private async _guardarCategoria(categoria: CategoriaProducto): Promise<void> {
        await conexion.query(
            "INSERT INTO categoriaProducto (idCategoriaProducto, nombreCategoria, descripcionCategoria) VALUES ($1, $2, $3)",
            [categoria.idCategoriaProducto, categoria.nombreCategoria, categoria.descripcionCategoria]
        );
    }

    private async _actualizarCategoria(categoriaActualizada: CategoriaProducto): Promise<boolean> {
        const result = await conexion.query(
            "UPDATE categoriaProducto SET nombreCategoria = $1, descripcionCategoria = $2 WHERE idCategoriaProducto = $3",
            [categoriaActualizada.nombreCategoria, categoriaActualizada.descripcionCategoria, categoriaActualizada.idCategoriaProducto]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarCategoria(id: number): Promise<boolean> {
        const result = await conexion.query("DELETE FROM categoriaProducto WHERE idCategoriaProducto = $1", [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerCategorias = withTryCatch(this._obtenerCategorias.bind(this), [], "Error al obtener categorías.");
    obtenerCategoriaPorId = withTryCatch(this._obtenerCategoriaPorId.bind(this), undefined, "Error al buscar categoría por ID.");
    obtenerCategoriaPorNombre = withTryCatch(this._obtenerCategoriaPorNombre.bind(this), undefined, "Error al buscar categoría por nombre.");
    guardarCategoria = withTryCatch(this._guardarCategoria.bind(this), undefined, "Error al guardar la categoría.");
    actualizarCategoria = withTryCatch(this._actualizarCategoria.bind(this), false, "Error al actualizar la categoría.");
    eliminarCategoria = withTryCatch(this._eliminarCategoria.bind(this), false, "Error al eliminar la categoría.");
}