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


// =====================
// Verifica AdminRole
// =====================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.rol === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};



// =====================
// Verifica Imagen
// =====================
let verificaTokenImg = (req, res, next) => {

    //lo que va en la url como: ?token=
    let token = req.query.token;

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
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}