import { EmpleadoRepository } from "../data/empleadoRepository";
import { Empleado } from "../models/Empleado";

export class EmpleadoService {

    private repository = new EmpleadoRepository();

    async obtenerEmpleados(): Promise<Empleado[]> {
        return await this.repository.obtenerEmpleados();
    }

    async obtenerEmpleadoPorId(id: number): Promise<Empleado | undefined> {
        return await this.repository.obtenerEmpleadoPorId(id);
    }

    async guardarEmpleado(empleado: Omit<Empleado, "idEmpleado">): Promise<Empleado> {
        return await this.repository.guardarEmpleado(empleado);
    }


    async actualizarEmpleado(empleado: Empleado): Promise<void> {
        const actualizado = await this.repository.actualizarEmpleado(empleado);

        if (!actualizado) {
            throw new Error("El empleado no existe.");
        }
    }

    async eliminarEmpleado(id: number): Promise<void> {
        const eliminado = await this.repository.eliminarEmpleado(id);

        if (!eliminado) {
            throw new Error("El empleado no existe.");
        }
    }
}