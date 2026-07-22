import { categoriaProducto } from "../models/CategoriaProducto";
import { withTryCatch } from "../utils/withTryCatch";

export class CategoriaProductoRepository {

    private db: categoriaProducto[] = [];

    private async _obtenerCategorias(): Promise<categoriaProducto[]> {
        return this.db;
    }

    private async _obtenerCategoriaPorId(id: number): Promise<categoriaProducto | undefined> {
        return this.db.find(c => c.id_categoria_producto === id);
    }

    private async _obtenerCategoriaPorNombre(nombre: number): Promise<categoriaProducto | undefined> {
        return this.db.find(c => c.nombre_categoria === nombre);
    }

    private async _guardarCategoria(categoria: categoriaProducto): Promise<void> {
        this.db.push(categoria);
    }

    private async _actualizarCategoria(categoriaActualizada: categoriaProducto): Promise<boolean> {
        const indice = this.db.findIndex(c => c.id_categoria_producto === categoriaActualizada.id_categoria_producto);

        if (indice === -1) return false;

        this.db[indice] = categoriaActualizada;
        return true;
    }

    private async _eliminarCategoria(id: number): Promise<boolean> {
        const nuevasCategorias = this.db.filter(c => c.id_categoria_producto !== id);

        if (this.db.length === nuevasCategorias.length) return false;

        this.db = nuevasCategorias;
        return true;
    }

    obtenerCategorias = withTryCatch(
        this._obtenerCategorias.bind(this),
        [],
        "Error al obtener categorías."
    );

    obtenerCategoriaPorId = withTryCatch(
        this._obtenerCategoriaPorId.bind(this),
        undefined,
        "Error al buscar categoría por ID."
    );

    obtenerCategoriaPorNombre = withTryCatch(
        this._obtenerCategoriaPorNombre.bind(this),
        undefined,
        "Error al buscar categoría por nombre."
    );

    guardarCategoria = withTryCatch(
        this._guardarCategoria.bind(this),
        undefined,
        "Error al guardar la categoría."
    );

    actualizarCategoria = withTryCatch(
        this._actualizarCategoria.bind(this),
        false,
        "Error al actualizar la categoría."
    );

    eliminarCategoria = withTryCatch(
        this._eliminarCategoria.bind(this),
        false,
        "Error al eliminar la categoría."
    );
}