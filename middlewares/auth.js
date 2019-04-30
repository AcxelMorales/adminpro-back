const jwt = require('jsonwebtoken');
const C = require('../config/config');

// Middleware
// verifica token
exports.verifyToken = function (req, res, next) {

    let token = req.query.token;

    jwt.verify(token, C.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token invalido',
                errors: err
            });
        }

        // asignamos a el request el usuario que hizo la acción pertinente
        req.usuario = decoded.usuario;

        next();
    });
}