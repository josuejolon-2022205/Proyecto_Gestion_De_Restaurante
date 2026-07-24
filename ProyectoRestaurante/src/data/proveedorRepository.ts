import { Proveedor } from "../models/Proveedor";
import { withTryCatch } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class ProveedorRepository {

    private async _obtenerProveedores(): Promise<Proveedor[]> {
        const result = await conexion.query("select * from proveedor");
        return result.rows;
    }

    private async _obtenerProveedorPorId(id: number): Promise<Proveedor | undefined> {
        const result = await conexion.query("select * from proveedor where idProveedor = $1", [id]);
        return result.rows[0];
    }

    private async _obtenerProveedorPorCorreo(correo: string): Promise<Proveedor | undefined> {
        const result = await conexion.query("select * from proveedor where correoProveedor = $1", [correo]);
        return result.rows[0];
    }

    private async _guardarProveedor(proveedor: Proveedor): Promise<void> {
        await conexion.query(
            "insert into proveedor (idProveedor, nombreProveedor, telefonoProveedor, correoProveedor, direccion) values ($1, $2, $3, $4, $5)",
            [proveedor.idProveedor, proveedor.nombreProveedor, proveedor.telefonoProveedor, proveedor.correoProveedor, proveedor.direccion]
        );
    }

    private async _actualizarProveedor(proveedorActualizado: Proveedor): Promise<boolean> {
        const result = await conexion.query(
            "update proveedor set nombreProveedor = $1, telefonoProveedor = $2, correoProveedor = $3, direccion = $4 where idProveedor = $5",
            [proveedorActualizado.nombreProveedor, proveedorActualizado.telefonoProveedor, proveedorActualizado.correoProveedor, proveedorActualizado.direccion, proveedorActualizado.idProveedor]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarProveedor(id: number): Promise<boolean> {
        const result = await conexion.query("delete from proveedor where idProveedor = $1", [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerProveedores = withTryCatch(this._obtenerProveedores.bind(this), [], "Error al obtener proveedores.");
    obtenerProveedorPorId = withTryCatch(this._obtenerProveedorPorId.bind(this), undefined, "Error al buscar proveedor por ID.");
    obtenerProveedorPorCorreo = withTryCatch(this._obtenerProveedorPorCorreo.bind(this), undefined, "Error al buscar proveedor por correo.");
    guardarProveedor = withTryCatch(this._guardarProveedor.bind(this), undefined, "Error al guardar el proveedor.");
    actualizarProveedor = withTryCatch(this._actualizarProveedor.bind(this), false, "Error al actualizar el proveedor.");
    eliminarProveedor = withTryCatch(this._eliminarProveedor.bind(this), false, "Error al eliminar el proveedor.");
}