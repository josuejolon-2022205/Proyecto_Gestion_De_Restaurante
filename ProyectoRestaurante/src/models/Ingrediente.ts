export interface Ingrediente {
    idIngrediente: number;
    nombreIngrediente: string;
    stockActual: number;
    stockMinimo: number;
    fkIdProveedor: number;
}