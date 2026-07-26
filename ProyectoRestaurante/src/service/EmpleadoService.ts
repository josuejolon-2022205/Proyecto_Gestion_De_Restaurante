import { EmpleadoRepository } from "../data/empleadoRepository";
import { Empleado } from "../models/Empleado";
import { empleadoSchema, empleadoUpdateSchema } from "../validations/empleadoValidator";
import { validate } from "../validations/validate";
import { NotFoundError } from "../errors/NotFoundError";

export class EmpleadoService {

    private repository = new EmpleadoRepository();

    async obtenerEmpleados(): Promise<Empleado[]> {
        return await this.repository.obtenerEmpleados();
    }

    async obtenerEmpleadoPorId(id: number): Promise<Empleado | undefined> {
        return await this.repository.obtenerEmpleadoPorId(id);
    }

    async guardarEmpleado(empleado: unknown): Promise<Empleado> {
        const datosValidados = validate(empleadoSchema, empleado);
        return await this.repository.guardarEmpleado(datosValidados);
    }

    async actualizarEmpleado(empleado: unknown): Promise<void> {
        const datosValidados = validate(empleadoUpdateSchema, empleado);
        const actualizado = await this.repository.actualizarEmpleado(datosValidados as Empleado);

        if (!actualizado) {
            throw new NotFoundError("El empleado no existe.");
        }
    }

    async eliminarEmpleado(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarEmpleado(id);

        if (!eliminado) {
            throw new NotFoundError("El empleado no existe.");
        }
    }
}