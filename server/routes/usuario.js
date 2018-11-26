const express = require('express');
const app = express();

const Usuario = require('../models/usuario');
let { verificaToken } = require('../../server/middleware/autenticacion');

const bcrypt = require('bcrypt');
const _ = require('underscore');


//Mostrar
app.get('/usuario', verificaToken, (req, res) => {

    return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    });

    //numero de paginas
    let desde = req.query.desde || 0;

    //Castear numero
    desde = Number(desde);

    //Limite 
    let limite = req.query.limite || 50;
    limite = Number(limite);
    Usuario.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    registros: conteo
                });
            });

        });

});


//Actualizar
app.put('/usuario/:id', verificaToken, function(req, res) {
    //obtener id
    let id = req.params.id;
    //obtener body
    let body = _.pick(req.body, [
        'nombre',
        'email',
        'img',
        'role',
        'estado'
    ]);
    //Actualizar
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        //error
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //respuesta
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});

//Crear
app.post('/usuario', verificaToken, function(req, res) {

    let body = req.body;
    //Iniciarlizar Usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        rol: body.rol
    });

    //guardar en BD
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

//Borrar
app.delete('/usuario/:id', verificaToken, function(req, res) {
    //obtener id
    let id = req.params.id;
    //Eliminar
    // Usuario.findByIdAndRemove(id, (err, UsuarioBorrado) => {

    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, UsuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!UsuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no registrado"
                }
            });
        }

        res.json({
            ok: true,
            usuario: UsuarioBorrado
        });
    });
});


module.exports = app;