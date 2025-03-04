import express, { ErrorRequestHandler } from "express";
import { connectDB } from "./services/database.service";
import { linksRouter } from "./routes/links.router";
import { usuariosRouter } from "./routes/users.router";
import * as dotenv from 'dotenv';

const app = express();
dotenv.config({path: './backend/.env'});
const port = process.env.SERVER_PORT || 3000;

connectDB()
    .then(() => {
        app.use("/links",linksRouter);
        app.use("/users",usuariosRouter);
        app.listen(port, () => {
            console.log(`Servidor arrancado en http://localhost:${port}`);
        })
    })
    .catch((error: Error)  =>{
        console.error("Error al conectar a  base de datos",error)
        process.exit()
    })
    