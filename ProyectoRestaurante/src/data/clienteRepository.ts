import { Cliente } from "../models/Cliente";
import { withTryCatch, withTryCatchThrow } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class ClienteRepository {

    private async _obtenerClientes(): Promise<Cliente[]> {
        const result = await conexion.query('select * from "cliente"');
        return result.rows;
    }

    private async _obtenerClientePorId(id: number): Promise<Cliente | undefined> {
        const result = await conexion.query(
            'select * from "cliente" where "idCliente" = $1',
            [id]
        );
        return result.rows[0];
    }

    private async _obtenerClientePorCorreo(correo: string): Promise<Cliente | undefined> {
        const result = await conexion.query(
            'select * from "cliente" where "correoCliente" = $1',
            [correo]
        );
        return result.rows[0];
    }

    private async _guardarCliente(cliente: Omit<Cliente, "idCliente">): Promise<Cliente> {
        const result = await conexion.query(
            'insert into "cliente" ("nombreCliente", "apellidosCliente", "telefonoCliente", "correoCliente") values ($1, $2, $3, $4) returning "idCliente"',
            [cliente.nombreCliente, cliente.apellidosCliente, cliente.telefonoCliente, cliente.correoCliente]
        );
        if (!result.rows[0]) throw new Error("No se pudo obtener el id del cliente insertado");
        return { ...cliente, idCliente: result.rows[0].idCliente };
    }

    private async _actualizarCliente(clienteActualizado: Cliente): Promise<boolean> {
        const result = await conexion.query(
            'update "cliente" set "nombreCliente" = $1, "apellidosCliente" = $2, "telefonoCliente" = $3, "correoCliente" = $4 where "idCliente" = $5',
            [clienteActualizado.nombreCliente, clienteActualizado.apellidosCliente, clienteActualizado.telefonoCliente, clienteActualizado.correoCliente, clienteActualizado.idCliente]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarCliente(id: number): Promise<boolean> {
        const result = await conexion.query(
            'delete from "cliente" where "idCliente" = $1',
            [id]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerClientes = withTryCatch(this._obtenerClientes.bind(this), [], "Error al obtener clientes.");
    obtenerClientePorId = withTryCatch(this._obtenerClientePorId.bind(this), undefined, "Error al buscar cliente por ID.");
    obtenerClientePorCorreo = withTryCatch(this._obtenerClientePorCorreo.bind(this), undefined, "Error al buscar cliente por correo.");
    guardarCliente = withTryCatchThrow(this._guardarCliente.bind(this), "Error al guardar el cliente.");
    actualizarCliente = withTryCatchThrow(this._actualizarCliente.bind(this), "Error al actualizar el cliente.");
    eliminarCliente = withTryCatchThrow(this._eliminarCliente.bind(this), "Error al eliminar el cliente.");
}