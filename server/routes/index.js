const express = require('express');
const app = express();

//=========================
//  Importar rutas
//=========================
app.use(require('../routes/usuario'));
app.use(require('../routes/login'));
app.use(require('../routes/categoria'));
app.use(require('../routes/producto'));
app.use(require('../routes/upload'));
app.use(require('../routes/imagenes'));


module.exports = app;