const Usuario = require('../models/Usuario.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const C = require('../config/config');


// =====================
//  LOGIN CONTROLLER
// =====================
exports.login = (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuarios',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - email', // se quita el email en prod
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - pass', // se quita el pass en prod
                errors: err
            });
        }

        // Token
        usuarioDB.password = ':)';

        const token = jwt.sign({ usuario: usuarioDB }, C.SEED, { expiresIn: 14400 }); // 4 hrs

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token,
            id: usuarioDB._id
        });
    });
}