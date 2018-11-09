const express = require('express');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const app = express();

/*
    NO SER WEON, CONFIGURA BIEN TU POSTMAN :)
*/

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        //ERROR PETICION
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //ERROR USUARIO
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }
        //ERROR PASSWORD
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        //GENERAR TOKEN
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        //SI TODO ESTA BIEN, SE MANDA UN TRUE
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    })


});





module.exports = app;