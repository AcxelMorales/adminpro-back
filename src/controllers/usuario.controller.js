const Usuario = require('../models/Usuario.model');
const bcrypt = require('bcryptjs');
const auth = require('../middlewares/auth');

// ========================
//  GET Usuarios CONTROLLER
// ========================
exports.getUsuarios = (req, res) => {
    Usuario.find({}, 'nombre email img role').exec(
        (err, usuariosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error cargando usuarios',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuarios: usuariosDB
            });
        }
    );
}

// =========================
//  POST Usuarios CONTROLLER
// =========================
exports.postUsuario = (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioSave) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al guardar un usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioSave,
            usuarioToken: req.usuario
        });
    });
}

// ========================
//  PUT Usuarios CONTROLLER
// ========================
exports.putUsuario = (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar un usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                message: `El usuario con el id: ${id} no existe`,
                errors: {
                    message: 'No existe un usuario con ese ID'
                }
            });
        }

        usuarioDB.nombre = body.nombre;
        usuarioDB.email = body.email;
        usuarioDB.role = body.role;

        usuarioDB.save((err, usuarioSave) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioDB.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioSave
            });
        });
    });
}

// ===========================
//  DELETE Usuarios CONTROLLER
// ===========================
exports.deleteUsuario = (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioDelete) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar usuario',
                errors: err
            });
        }

        if (!usuarioDelete) {
            return res.status(400).json({
                ok: false,
                message: `El usuario con el id: ${id} no existe`,
                errors: {
                    message: 'No existe un usuario con ese ID'
                }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioDelete
        });
    });
}