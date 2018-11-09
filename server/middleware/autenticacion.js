const jwt = require('jsonwebtoken');
//===================
//Verificar TOKEN
//===================
let verificaToken = (req, res, next) => {

    //obtener headers con nombre token
    let token = req.get('token');
    //Verificar el Token, si es valido
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        }
        //el decoded es el payload
        req.usuario = decoded.usuario;
        //mandar la peticion
        next();
    });




};


module.exports = {
    verificaToken
}