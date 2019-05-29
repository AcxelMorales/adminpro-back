const Usuario = require('../models/Usuario.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const C = require('../config/config');

// Google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(C.CLIENT_ID);

// =====================
//     RENEW TOKEN
// =====================
exports.renewToken = (req, res) => {
    const token = jwt.sign({ usuario: req.usuario }, C.SEED, { expiresIn: 14400 }); // 4 hrs
    res.status(200).json({
        ok: true,
        token
    });
}

// =====================
//        GOOGLE
// =====================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: C.CLIENT_ID
    });

    const payload = ticket.getPayload();
    // const userid = payload['sub'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

exports.google = async (req, res) => {
    let token = req.body.token;

    const googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                message: 'Token no válido'
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuarios',
                errors: err
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    message: 'Debe de utilizar su autenticación normal'
                });
            } else {
                const token = jwt.sign({ usuario: usuarioDB }, C.SEED, { expiresIn: 14400 }); // 4 hrs

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                    id: usuarioDB._id,
                    menu: getMenu(usuarioDB.role)
                });
            }
        } else {
            // Creamos un nuevo usuario
            const usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al insertar usuario',
                        errors: err
                    });
                }

                const token = jwt.sign({ usuario: usuarioDB }, C.SEED, { expiresIn: 14400 }); // 4 hrs

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                    id: usuarioDB._id,
                    menu: getMenu(usuarioDB.role)
                });
            });
        }
    });
}

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
            id: usuarioDB._id,
            menu: getMenu(usuarioDB.role)
        });
    });
}

function getMenu (ROLE) {
    const menu = [
        {
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'ProgressBar', url: '/progress' },
                { titulo: 'Gráficas', url: '/graficas1' },
                { titulo: 'RXJS', url: '/rxjs' }
            ]
        },
        {
            titulo: 'Mantenimiento',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                { titulo: 'Médicos', url: '/doctors' },
                { titulo: 'Hospitales', url: '/hospitals' }
            ]
        }
    ];

    if (ROLE === 'ADMIN_ROLE') menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/users' });

    return menu;
}