export interface Empleado {
    idEmpleado: number;
    nombreEmpleado: string;
    apellidoEmpleado: string;
    telefonoEmpleado: string;
    direccionEmpleado: string;
    salarioEmpleado: number;
    fkIdCargo: number;
    fkIdUsuario: number;
}