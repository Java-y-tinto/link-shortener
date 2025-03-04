import express, { Request, Response } from "express";
import Usuario from '../models/usuario';
import { colecciones } from "../services/database.service";
import { ObjectId } from "mongodb";


export const usuariosRouter = express.Router();

usuariosRouter.use(express.json());


// GET - Obtener todos los usuarios
usuariosRouter.get("/", async (req: Request, res: Response) => {
    try {
        const usuarios = (await colecciones.users?.find({}).toArray()) as Usuario[];
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET - Obtener un usuario por ID
usuariosRouter.get('/:id', async (req: Request, res: Response) => {
    const id = req?.params?.id;
    try {
        const query = { _id: new ObjectId(id) };
        const usuario = (await colecciones.users?.findOne(query)) as Usuario;
        
        if (usuario) {
            res.status(200).json(usuario);
        } else {
            res.status(404).send(`No se encontró el usuario con id ${id}`);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST - Crear un nuevo usuario
usuariosRouter.post('/', async (req: Request, res: Response) => {
    try {
        const usuario = req.body as Usuario;
        const result = await colecciones.users?.insertOne(usuario);
        result
            ? res.status(201).send(`Usuario creado exitosamente con la id ${result.insertedId}`)
            : res.status(500).send('Error al crear el usuario');
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// PUT - Actualizar un usuario existente
usuariosRouter.put('/:id', async (req: Request, res: Response) => {
    const id = req?.params.id;
    try {
        const updatedUsuario: Usuario = req.body as Usuario;
        const query = { _id: new ObjectId(id) };
        const result = await colecciones.users?.updateOne(query, { $set: updatedUsuario });
        
        if (result?.matchedCount) {
            res.status(200).send(`Usuario actualizado exitosamente con la id ${id}`);
        } else {
            res.status(404).send(`Usuario con id: ${id} no encontrado`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// DELETE - Eliminar un usuario
usuariosRouter.delete('/:id', async (req: Request, res: Response) => {
    const id = req?.params.id;
    try {
        const query = { _id: new ObjectId(id) };
        const result = await colecciones.users?.deleteOne(query);
        
        if (result && result.deletedCount) {
            res.status(200).send(`Usuario con id ${id} eliminado exitosamente`);
        } else if (!result) {
            res.status(400).send(`No se pudo borrar el usuario con id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Usuario con id ${id} no se encuentra o no existe`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});