const jwt = require('jsonwebtoken');
const C = require('../config/config');

// ---------- Middleware
// =========================
//         TOKEN
// =========================
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

// ---------- Middleware
// =========================
//        ADMIN_ROLE
// =========================
exports.verifyADMIN_ROLE = function (req, res, next) {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Error',
            errors: {
                message: 'No es administrador'
            }
        });
    }
}

// ---------- Middleware
// ===========================
// ADMIN_ROLE o Mismo Usuario
// ===========================
exports.verifyADMIN_o_MismoUsuario = function (req, res, next) {
    let usuario = req.usuario;
    let id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Error',
            errors: {
                message: 'No es administrador ni es el mismo usuario'
            }
        });
    }
}