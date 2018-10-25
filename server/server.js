require('./config/config.js');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Mostrar
app.get('/usuario', function(req, res) {
    res.json('get usuario')
})

//Crear
app.post('/usuario', function(req, res) {

    let body = req.body;

    if (body.nombre === undefined) {

        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });

    } else {
        res.json({
            body
        });
    }
})

//Actualizar
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    });
})

//Borrar
app.delete('/usuario', function(req, res) {
    res.json('delete usuario')
})

//Levantar servicio
app.listen(process.env.PORT, () => {
    console.log("escuchando puerto:", 3000)
});