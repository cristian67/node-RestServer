const express = require('express');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

//Google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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


//Configuraciones de GOOGLE: el token se agrega por q no lo tenmos directamente.
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    //Devuelve todo un objeto de google
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}

//ruta: funcion asincrona debido a que google trabaja con esta funcion async
app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    //SI el tipo tiene un Usuario
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        //ERROR PETICION
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //correo con google ya inscrito en la BDD
        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'debe usar la autenticacion normal'
                    }
                });
            } //Ya sea un usuario autenticado con google, renovar token
            else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } //SI EL USUARIO NO EXISTE EN LA BDD
        else {
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            //solo para pasar la validacion
            usuario.password = ':)'

            //GUARDAR EN BDD
            usuario.save((err, usuarioDB) => {
                //ERROR
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            });
        }


    });

});


module.exports = app;