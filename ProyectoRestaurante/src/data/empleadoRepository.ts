import { Empleado } from "../models/Empleado";
import { withTryCatch, withTryCatchThrow } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class EmpleadoRepository {

    private async _obtenerEmpleados(): Promise<Empleado[]> {
        const result = await conexion.query('select * from "empleado"');
        return result.rows;
    }

    private async _obtenerEmpleadoPorId(id: number): Promise<Empleado | undefined> {
        const result = await conexion.query('select * from "empleado" where "idEmpleado" = $1', [id]);
        return result.rows[0];
    }

    private async _guardarEmpleado(empleado: Omit<Empleado, "idEmpleado">): Promise<Empleado> {
        const result = await conexion.query(
            'insert into "empleado" ("nombreEmpleado", "apellidoEmpleado", "telefonoEmpleado", "direccionEmpleado", "salarioEmpleado", "fkIdCargo", "fkIdUsuario") values ($1, $2, $3, $4, $5, $6, $7) returning "idEmpleado"',
            [empleado.nombreEmpleado, empleado.apellidoEmpleado, empleado.telefonoEmpleado, empleado.direccionEmpleado, empleado.salarioEmpleado, empleado.fkIdCargo, empleado.fkIdUsuario]
        );
        if (!result.rows[0]) throw new Error("No se pudo obtener el id del empleado insertado");
        return { ...empleado, idEmpleado: result.rows[0].idEmpleado };
    }

    private async _actualizarEmpleado(empleadoActualizado: Empleado): Promise<boolean> {
        const result = await conexion.query('update "empleado" set "nombreEmpleado" = $1, "apellidoEmpleado" = $2, "telefonoEmpleado" = $3, "direccionEmpleado" = $4, "salarioEmpleado" = $5, "fkIdCargo" = $6, "fkIdUsuario" = $7 where "idEmpleado" = $8',
            [empleadoActualizado.nombreEmpleado, empleadoActualizado.apellidoEmpleado, empleadoActualizado.telefonoEmpleado, empleadoActualizado.direccionEmpleado, empleadoActualizado.salarioEmpleado, empleadoActualizado.fkIdCargo, empleadoActualizado.fkIdUsuario, empleadoActualizado.idEmpleado]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarEmpleado(id: number): Promise<boolean> {
        const result = await conexion.query('delete from "empleado" where "idEmpleado" = $1', [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerEmpleados = withTryCatch(this._obtenerEmpleados.bind(this), [], "Error al obtener empleados.");
    obtenerEmpleadoPorId = withTryCatch(this._obtenerEmpleadoPorId.bind(this), undefined, "Error al buscar empleado por ID.");
    guardarEmpleado = withTryCatchThrow(this._guardarEmpleado.bind(this), "Error al guardar el empleado.");
    actualizarEmpleado = withTryCatchThrow(this._actualizarEmpleado.bind(this), "Error al actualizar el empleado.");
    eliminarEmpleado = withTryCatchThrow(this._eliminarEmpleado.bind(this), "Error al eliminar el empleado.");
}