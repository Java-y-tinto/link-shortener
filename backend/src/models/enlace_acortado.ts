// External dependencies
import { ObjectId } from "mongodb";
// Class Implementation
export default class EnlaceAcortado {
    _id?: ObjectId;
    enlaceOriginal: string;
    enlaceAcortado: string;
    userid: ObjectId;
    constructor(enlaceOriginal: string, enlaceAcortado: string,userid: ObjectId) {
        this.enlaceOriginal = enlaceOriginal;
        this.enlaceAcortado = enlaceAcortado;
        this.userid = userid
    }
}