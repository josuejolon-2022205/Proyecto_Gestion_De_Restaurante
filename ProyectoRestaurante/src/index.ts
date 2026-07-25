import { server } from "./api/server"

server.listen(3000, () => {
    console.log("el server esta corriendo en http://localhost:3000");
})