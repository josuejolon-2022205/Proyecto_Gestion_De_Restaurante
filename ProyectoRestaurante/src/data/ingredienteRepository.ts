import { Ingrediente } from "../models/Ingrediente";
import { withTryCatch } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class IngredienteRepository {

    private async _obtenerIngredientes(): Promise<Ingrediente[]> {
        const result = await conexion.query("select * from ingrediente");
        return result.rows;
    }

    private async _obtenerIngredientePorId(id: number): Promise<Ingrediente | undefined> {
        const result = await conexion.query("select * from ingrediente where idIngrediente = $1", [id]);
        return result.rows[0];
    }

    private async _obtenerIngredientePorNombre(nombre: string): Promise<Ingrediente | undefined> {
        const result = await conexion.query("select * from ingrediente where nombreIngrediente = $1", [nombre]);
        return result.rows[0];
    }

    private async _guardarIngrediente(ingrediente: Ingrediente): Promise<void> {
        await conexion.query(
            "insert into ingrediente (idIngrediente, nombreIngrediente, stockActual, stockMinimo, fkIdProveedor) values ($1, $2, $3, $4, $5)",
            [ingrediente.idIngrediente, ingrediente.nombreIngrediente, ingrediente.stockActual, ingrediente.stockMinimo, ingrediente.fkIdProveedor]
        );
    }

    private async _actualizarIngrediente(ingredienteActualizado: Ingrediente): Promise<boolean> {
        const result = await conexion.query(
            "update ingrediente set nombreIngrediente = $1, stockActual = $2, stockMinimo = $3, fkIdProveedor = $4 where idIngrediente = $5",
            [ingredienteActualizado.nombreIngrediente, ingredienteActualizado.stockActual, ingredienteActualizado.stockMinimo, ingredienteActualizado.fkIdProveedor, ingredienteActualizado.idIngrediente]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarIngrediente(id: number): Promise<boolean> {
        const result = await conexion.query("delete from ingrediente where idIngrediente = $1", [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerIngredientes = withTryCatch(this._obtenerIngredientes.bind(this), [], "Error al obtener ingredientes.");
    obtenerIngredientePorId = withTryCatch(this._obtenerIngredientePorId.bind(this), undefined, "Error al buscar ingrediente por ID.");
    obtenerIngredientePorNombre = withTryCatch(this._obtenerIngredientePorNombre.bind(this), undefined, "Error al buscar ingrediente por nombre.");
    guardarIngrediente = withTryCatch(this._guardarIngrediente.bind(this), undefined, "Error al guardar el ingrediente.");
    actualizarIngrediente = withTryCatch(this._actualizarIngrediente.bind(this), false, "Error al actualizar el ingrediente.");
    eliminarIngrediente = withTryCatch(this._eliminarIngrediente.bind(this), false, "Error al eliminar el ingrediente.");
}