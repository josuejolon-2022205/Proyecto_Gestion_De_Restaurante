import { CategoriaProducto } from "../models/CategoriaProducto";
import { withTryCatch, withTryCatchThrow } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class CategoriaProductoRepository {

    private async _obtenerCategorias(): Promise<CategoriaProducto[]> {
        const result = await conexion.query('select * from "categoriaProducto"');
        return result.rows;
    }

    private async _obtenerCategoriaPorId(id: number): Promise<CategoriaProducto | undefined> {
        const result = await conexion.query(
            'select * from "categoriaProducto" where "idCategoriaProducto" = $1',
            [id]
        );
        return result.rows[0];
    }

    private async _obtenerCategoriaPorNombre(nombre: string): Promise<CategoriaProducto | undefined> {
        const result = await conexion.query(
            'select * from "categoriaProducto" where "nombreCategoria" = $1',
            [nombre]
        );
        return result.rows[0];
    }

    private async _guardarCategoria(categoria: Omit<CategoriaProducto, "idCategoriaProducto">): Promise<CategoriaProducto> {
        const result = await conexion.query(
            'insert into "categoriaProducto" ("nombreCategoria", "descripcionCategoria") values ($1, $2) returning "idCategoriaProducto"',
            [categoria.nombreCategoria, categoria.descripcionCategoria]
        );
        if (!result.rows[0]) throw new Error("No se pudo obtener el id de la categoria insertada");
        return { ...categoria, idCategoriaProducto: result.rows[0].idCategoriaProducto };
    }

    private async _actualizarCategoria(categoriaActualizada: CategoriaProducto): Promise<boolean> {
        const result = await conexion.query(
            'update "categoriaProducto" set "nombreCategoria" = $1, "descripcionCategoria" = $2 where "idCategoriaProducto" = $3',
            [categoriaActualizada.nombreCategoria, categoriaActualizada.descripcionCategoria, categoriaActualizada.idCategoriaProducto]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarCategoria(id: number): Promise<boolean> {
        const result = await conexion.query(
            'delete from "categoriaProducto" where "idCategoriaProducto" = $1',
            [id]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerCategorias = withTryCatch(this._obtenerCategorias.bind(this), [], "Error al obtener categorías.");
    obtenerCategoriaPorId = withTryCatch(this._obtenerCategoriaPorId.bind(this), undefined, "Error al buscar categoría por ID.");
    obtenerCategoriaPorNombre = withTryCatch(this._obtenerCategoriaPorNombre.bind(this), undefined, "Error al buscar categoría por nombre.");
    guardarCategoria = withTryCatchThrow(this._guardarCategoria.bind(this), "Error al guardar la categoria.");
    actualizarCategoria = withTryCatchThrow(this._actualizarCategoria.bind(this), "Error al actualizar la categoria.");
    eliminarCategoria = withTryCatchThrow(this._eliminarCategoria.bind(this), "Error al eliminar la categoria.");
}