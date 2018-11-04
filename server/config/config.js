//=============
// Puerto
//=============

process.env.PORT = process.env.PORT || 3000;

//=============
// Entorno
//=============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//=============
// Base de Dato
//=============
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://test:123admin@ds229609.mlab.com:29609/cafe';
}
process.env.URLDB = urlDB;