import { Pool } from "pg";

export const conexion = new Pool({
    host: "localhost",
    port: 5432,
    database: "dbGestionDeRestauranteIn5cm",
    user: "postgres",
    password: "2009"
});