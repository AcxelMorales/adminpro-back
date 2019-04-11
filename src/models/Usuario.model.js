const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let rolesValidos = {
    values: [
        'ADMIN_ROLE',
        'USER_ROLE'
    ],
    message: '{VALUE} no es un rol permitido'
};

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'El email es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es necesario']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: rolesValidos
    }
});

usuarioSchema.plugin(uniqueValidator, {
    message: 'El email debe de ser único'
});

module.exports = mongoose.model('Usuario', usuarioSchema);