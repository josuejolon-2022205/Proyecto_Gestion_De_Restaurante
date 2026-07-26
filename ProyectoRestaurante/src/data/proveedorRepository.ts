import { Proveedor } from "../models/Proveedor";
import { withTryCatch, withTryCatchThrow } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class ProveedorRepository {

    private async _obtenerProveedores(): Promise<Proveedor[]> {
        const result = await conexion.query('select * from "proveedor"');
        return result.rows;
    }

    private async _obtenerProveedorPorId(id: number): Promise<Proveedor | undefined> {
        const result = await conexion.query('select * from "proveedor" where "idProveedor" = $1', [id]);
        return result.rows[0];
    }

    private async _obtenerProveedorPorCorreo(correo: string): Promise<Proveedor | undefined> {
        const result = await conexion.query('select * from "proveedor" where "correoProveedor" = $1', [correo]);
        return result.rows[0];
    }

    private async _guardarProveedor(proveedor: Omit<Proveedor, "idProveedor">): Promise<Proveedor> {
        const result = await conexion.query(
            'insert into "proveedor" ("nombreProveedor", "telefonoProveedor", "correoProveedor", "direccion") values ($1, $2, $3, $4) returning "idProveedor"',
            [proveedor.nombreProveedor, proveedor.telefonoProveedor, proveedor.correoProveedor, proveedor.direccion]
        );
        if (!result.rows[0]) throw new Error("No se pudo obtener el id del proveedor insertado");
        return { ...proveedor, idProveedor: result.rows[0].idProveedor };
    }

    private async _actualizarProveedor(proveedorActualizado: Proveedor): Promise<boolean> {
        const result = await conexion.query(
            'update "proveedor" set "nombreProveedor" = $1, "telefonoProveedor" = $2, "correoProveedor" = $3, "direccion" = $4 where "idProveedor" = $5',
            [proveedorActualizado.nombreProveedor, proveedorActualizado.telefonoProveedor, proveedorActualizado.correoProveedor, proveedorActualizado.direccion, proveedorActualizado.idProveedor]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarProveedor(id: number): Promise<boolean> {
        const result = await conexion.query('delete from "proveedor" where "idProveedor" = $1', [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerProveedores = withTryCatch(this._obtenerProveedores.bind(this), [], "Error al obtener proveedores.");
    obtenerProveedorPorId = withTryCatch(this._obtenerProveedorPorId.bind(this), undefined, "Error al buscar proveedor por ID.");
    obtenerProveedorPorCorreo = withTryCatch(this._obtenerProveedorPorCorreo.bind(this), undefined, "Error al buscar proveedor por correo.");
    guardarProveedor = withTryCatchThrow(this._guardarProveedor.bind(this), "Error al guardar el proveedor.");
    actualizarProveedor = withTryCatchThrow(this._actualizarProveedor.bind(this), "Error al actualizar el proveedor.");
    eliminarProveedor = withTryCatchThrow(this._eliminarProveedor.bind(this), "Error al eliminar el proveedor.");
}