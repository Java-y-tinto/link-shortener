// External dependencies
import { ObjectId } from 'mongodb';

// Class Implementation
export default class Usuario {
    _id?: ObjectId;
    name: string;
    email: string;
    password: string;
    created_at: Date;
    constructor(name: string,email: string, password: string,_id?: ObjectId) {
        this.name = name;
        this.email = email;
        this.password = password;
        this._id = _id;
        this.created_at = new Date(Date.now());
    }
}