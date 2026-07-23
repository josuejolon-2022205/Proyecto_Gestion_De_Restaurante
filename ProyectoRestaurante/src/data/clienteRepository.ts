import { Cliente } from "../models/Cliente";
import { withTryCatch } from "../utils/withTryCatch";
import { conexion } from "../config/database";

export class ClienteRepository {

    private async _obtenerClientes(): Promise<Cliente[]> {
        const result = await conexion.query("SELECT * FROM cliente");
        return result.rows;
    }

    private async _obtenerClientePorId(id: number): Promise<Cliente | undefined> {
        const result = await conexion.query("SELECT * FROM cliente WHERE idCliente = $1", [id]);
        return result.rows[0];
    }

    private async _obtenerClientePorCorreo(correo: string): Promise<Cliente | undefined> {
        const result = await conexion.query("SELECT * FROM cliente WHERE correoCliente = $1", [correo]);
        return result.rows[0];
    }

    private async _guardarCliente(cliente: Cliente): Promise<void> {
        await conexion.query(
            "INSERT INTO cliente (idCliente, nombreCliente, apellidosCliente, telefonoCliente, correoCliente) VALUES ($1, $2, $3, $4, $5)",
            [cliente.idCliente, cliente.nombreCliente, cliente.apellidosCliente, cliente.telefonoCliente, cliente.correoCliente]
        );
    }

    private async _actualizarCliente(clienteActualizado: Cliente): Promise<boolean> {
        const result = await conexion.query(
            "UPDATE cliente SET nombreCliente = $1, apellidosCliente = $2, telefonoCliente = $3, correoCliente = $4 WHERE idCliente = $5",
            [clienteActualizado.nombreCliente, clienteActualizado.apellidosCliente, clienteActualizado.telefonoCliente, clienteActualizado.correoCliente, clienteActualizado.idCliente]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    private async _eliminarCliente(id: number): Promise<boolean> {
        const result = await conexion.query("DELETE FROM cliente WHERE idCliente = $1", [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    obtenerClientes = withTryCatch(this._obtenerClientes.bind(this), [], "Error al obtener clientes.");
    obtenerClientePorId = withTryCatch(this._obtenerClientePorId.bind(this), undefined, "Error al buscar cliente por ID.");
    obtenerClientePorCorreo = withTryCatch(this._obtenerClientePorCorreo.bind(this), undefined, "Error al buscar cliente por correo.");
    guardarCliente = withTryCatch(this._guardarCliente.bind(this), undefined, "Error al guardar el cliente.");
    actualizarCliente = withTryCatch(this._actualizarCliente.bind(this), false, "Error al actualizar el cliente.");
    eliminarCliente = withTryCatch(this._eliminarCliente.bind(this), false, "Error al eliminar el cliente.");
}