import { ClienteRepository } from "../data/clienteRepository";
import { NotFoundError } from "../errors/indexErrors";
import { Cliente } from "../models/Cliente";
import { clienteSchema, clienteUpdateSchema } from "../validations/clienteValidator";
import { validate } from "../validations/validate";

export class ClienteService {

    private repository = new ClienteRepository();

    async obtenerClientes(): Promise<Cliente[]> {
        return await this.repository.obtenerClientes();
    }

    async obtenerClientePorId(id: number): Promise<Cliente | undefined> {
        return await this.repository.obtenerClientePorId(id);
    }

    async guardarCliente(cliente: Omit<Cliente, "idCliente">): Promise<Cliente> {
        const datosValidados = validate(clienteSchema, cliente);

        const correoExiste = await this.repository.obtenerClientePorCorreo(datosValidados.correoCliente);
        if (correoExiste) {
            throw new Error("El correo ya está registrado.");
        }
        return await this.repository.guardarCliente(datosValidados);
    }

    async actualizarCliente(cliente: unknown): Promise<void> {
            const datosValidados = validate(clienteUpdateSchema, cliente);
            const actualizado = await this.repository.actualizarCliente(datosValidados as Cliente);

            if(!actualizado) {
                throw new NotFoundError("El cliente no existe.");
            }
        }

    async eliminarCliente(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarCliente(id);

        if(!eliminado) {
            throw new NotFoundError("El cliente no existe.");
        }
    }
}