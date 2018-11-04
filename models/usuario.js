const moongose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let Schema = moongose.Schema;

let RolValidos = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} rol no es valido'

};

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesario']
    },
    img: {
        type: String,
        required: false
    },
    rol: {
        type: String,
        default: 'USER_ROLE',
        enum: RolValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//borrar pass
usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = moongose.model('Usuario', usuarioSchema);