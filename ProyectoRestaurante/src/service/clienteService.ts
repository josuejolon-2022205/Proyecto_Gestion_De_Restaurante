import { ClienteRepository } from "../data/clienteRepository";
import { Cliente } from "../models/Cliente";

export class ClienteService {

    private repository = new ClienteRepository();

    async obtenerClientes(): Promise<Cliente[]> {
        return await this.repository.obtenerClientes();
    }

    async obtenerClientePorId(id: number): Promise<Cliente | undefined> {
        return await this.repository.obtenerClientePorId(id);
    }

    async guardarCliente(cliente: Cliente): Promise<void> {
        const existe = await this.repository.obtenerClientePorId(cliente.idCliente);

        if(existe) {
            throw new Error("El ID de cliente ya existe.");
        }

        const correoExiste = await this.repository.obtenerClientePorCorreo(cliente.correoCliente);

        if(correoExiste) {
            throw new Error("El correo ya está registrado.");
        }

        await this.repository.guardarCliente(cliente);
    }

    async actualizarCliente(cliente: Cliente): Promise<void> {
        const actualizado = await this.repository.actualizarCliente(cliente);

        if(!actualizado) {
            throw new Error("El cliente no existe.");
        }
    }

    async eliminarCliente(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarCliente(id);

        if(!eliminado) {
            throw new Error("El cliente no existe.");
        }
    }
}