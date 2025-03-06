// External Dependencies
import express, { Request, Response } from "express";
import EnlaceAcortado from "../models/enlace_acortado";
import { colecciones } from "../services/database.service";
import { ObjectId } from "mongodb";

// Global Config
export const linksRouter = express.Router();

linksRouter.use(express.json());


// ======= ROUTES PARA ENLACES =======

// GET - Obtener todos los enlaces
linksRouter.get("/", async (req: Request, res: Response) => {
    try {
        const links = (await colecciones.links?.find({}).toArray()) as EnlaceAcortado[];
        res.status(200).json(links);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET - Obtener un enlace por ID
linksRouter.get('/:id', async (req: Request, res: Response) => {
    const id = req?.params?.id;
    try {
        const query = { _id: new ObjectId(id) };
        const link = (await colecciones.links?.findOne(query)) as EnlaceAcortado;
        
        if (link) {
            res.status(200).json(link);
        } else {
            res.status(404).send(`No se encontró el enlace con id ${id}`);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST - Crear un nuevo enlace
linksRouter.post('/', async (req: Request, res: Response) => {
    try {
        const link = req.body as EnlaceAcortado;
        const result = await colecciones.links?.insertOne(link);
        result
            ? res.status(201).send(`Link creado exitosamente con la id ${result.insertedId}`)
            : res.status(500).send('Error al crear el link');
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// PUT - Actualizar un enlace existente
linksRouter.put('/:id', async (req: Request, res: Response) => {
    const id = req?.params.id;
    try {
        const updatedLink: EnlaceAcortado = req.body as EnlaceAcortado;
        const query = { _id: new ObjectId(id) };
        const result = await colecciones.links?.updateOne(query, { $set: updatedLink });
        
        if (result?.matchedCount) {
            res.status(200).send(`Link actualizado exitosamente con la id ${id}`);
        } else {
            res.status(404).send(`Link con id: ${id} no encontrado`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// DELETE - Eliminar un enlace
linksRouter.delete('/:id', async (req: Request, res: Response) => {
    const id = req?.params.id;
    try {
        const query = { _id: new ObjectId(id) };
        const result = await colecciones.links?.deleteOne(query);
        
        if (result && result.deletedCount) {
            res.status(200).send(`Link con id ${id} eliminado exitosamente`);
        } else if (!result) {
            res.status(400).send(`No se pudo borrar el link con id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Link con id ${id} no se encuentra o no existe`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

// ======= ROUTES PARA USUARIOS =======

