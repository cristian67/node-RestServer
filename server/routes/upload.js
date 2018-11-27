const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

//Modelo Usuario 
const Usuario = require('../models/usuario');
//Modelo Producto
const Producto = require('../models/producto');

//Filesystem para borrar sin problemas
const fs = require('fs');
//Path para manejar las rutas
const path = require('path');


// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    //ERROR
    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: {
                messsage: "No se a encontrado archivo"
            }
        })
    }


    //VALIDAR EXTENSIONES
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                messsage: "tipos validos:" + tiposValidos.join(', ')
            }
        });
    }

    //VALIDAR EXTENSIONES
    let archivo = req.files.archivo;

    //Obtener el nombre del Archivo
    let nombreCortado = archivo.name.split('.');
    //obtener ultima posicion
    let extensionArchivo = nombreCortado[1];

    let extencionesValindas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extencionesValindas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                messsage: "Extensiones permitidas:" + extencionesValindas.join(', '),
                ext: extensionArchivo
            }
        });
    }
    //CAMBIAR NOMBRE ARCHIVO
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
    //SUBIR ARCHIVO
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo, tipo);
        } else {
            imagenProducto(id, res, nombreArchivo, tipo);

        }
    });

});



////----------------//
///BORRAR ARCHIVO///
///----------------///
function borrarArchivo(nombreArchivo, tipo) {
    let pathURL = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(pathURL)) {
        fs.unlinkSync(pathURL);
    }

}



////----------------//
///IMAGENES USUARIO///
///----------------///
//Es necesario enviar res como parametro
function imagenUsuario(id, res, nombreArchivo, tipo) {

    Usuario.findById(id, (err, usuarioDB) => {
        //VALIDACIONES
        if (err) {
            borrarArchivo(nombreArchivo, tipo);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    messsage: "Usuario no existe"
                }
            });
        }

        //DETECTAR PATH ANTERIOR Y BORRAR
        borrarArchivo(usuarioDB.img, tipo);

        //ACTUALIZAR IMG
        usuarioDB.img = nombreArchivo;
        //GUARDAR EN BD
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        })

    });

}



////----------------//
///IMAGENES PRODUCTO///
///----------------///
function imagenProducto(id, res, nombreArchivo, tipo) {

    Producto.findById(id, (err, productoDB) => {
        //VALIDACIONES
        if (err) {
            borrarArchivo(nombreArchivo, tipo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    messsage: "Producto no existe"
                }
            });
        }

        //DETECTAR PATH ANTERIOR Y BORRAR
        borrarArchivo(productoDB.img, tipo);

        //ACTUALIZAR IMG
        productoDB.img = nombreArchivo;
        //GUARDAR EN BD
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        })

    });

}


module.exports = app;