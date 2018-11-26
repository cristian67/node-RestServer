require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const path = require('path');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// Config global de rutas
app.use(require('./routes/index'));

//Habilitar el carpeta public 
app.use(express.static(path.resolve(__dirname, '../public')));

// Conectar a BDD
mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log("Conectado a BDD")
});

// Levantar servicio
app.listen(process.env.PORT, () => {
    console.log("escuchando puerto:", 3000)
});