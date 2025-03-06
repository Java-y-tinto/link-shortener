// External Dependencies
import * as mongoDB from "mongodb"
import * as dotenv from "dotenv"
import * as path from 'path'
import * as fs from 'fs';
// Global Variables
export const colecciones: {links?: mongoDB.Collection,users?: mongoDB.Collection} = {}
// Initialize Connection
export async function connectDB() {    
    dotenv.config({path: './backend/.env'})
    const CONN_STRING = process.env.DB_CONN_STRING! + process.env.DB_USER! + ':' + process.env.DB_PASSWD! + `@${process.env.DB_HOST}` + `/${process.env.DB_NAME}`
    
    const client = new mongoDB.MongoClient(CONN_STRING)
    await client.connect();
    
    
    const db: mongoDB.Db = client.db(process.env.DB_NAME!)

    await db.command({
        "collMod": process.env.SHORTENER_COLLECTION_NAME!,
        "validator": {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["short_url", "long_url", "user_id"],
                "properties": {
                    "short_url": {
                        "bsonType": "string",
                        "description": "must be a string and is required"
                    },
                    "long_url": {
                        "bsonType": "string",
                        "description": "must be a string and is required"
                    },
                    "user_id": {
                        "bsonType": "string",
                    }
                }
            }
        }
    })

    await db.command(
        {
            "collMod": process.env.USERS_COLLECTION_NAME!,
            "validator": {
                "$jsonSchema": {
                    "bsonType": "object",
                    "required": ["name", "email", "password"],
                    "properties": {
                        "name": {
                            "bsonType": "string",
                            "description": "must be a string and is required"
                        },
                        "email": {
                            "bsonType": "string",
                            "description": "must be a string and is required"
                        },
                        "password": {
                            "bsonType": "string",
                            "description": "must be a string and is required"
                        }
                    }
                }
            }
        }
    )

    const colecionEnlaces: mongoDB.Collection = db.collection(process.env.SHORTENER_COLLECTION_NAME!)  
    const coleccionUsuarios: mongoDB.Collection = db.collection(process.env.USERS_COLLECTION_NAME!)

    colecciones.links = colecionEnlaces
    colecciones.users = coleccionUsuarios
    console.log(`Conexion con base de datos ${db.databaseName} exitosa`)
}