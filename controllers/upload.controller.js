const fs = require('fs');

const Usuario = require('../models/Usuario.model');
const Medico = require('../models/Medico.model');
const Hospital = require('../models/Hospital.model');

// ============================
//  UPLOAD IMAGE CONTROLLER
// ============================
exports.uploadImage = (req, res) => {
    let table = req.params.table;
    let id = req.params.id;

    // Tables validas
    const tablesOk = ['medicos', 'hospitales', 'usuarios'];

    if (tablesOk.indexOf(table) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Tabla/Colección no valida',
            errors: {
                message: `Las tablas válidas son: ${tablesOk.join(', ')}`
            }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No selecciono nada',
            errors: {
                message: 'Debe seleccionar una imagen'
            }
        });
    }

    // Obtener el nombre del archivo
    let archivo = req.files.img;
    let nombreArchivoCortado = archivo.name.split('.');
    let extension = nombreArchivoCortado[nombreArchivoCortado.length - 1];

    // Extensiones validas
    const extensionesOk = ['png', 'gif', 'jpg', 'jpeg'];

    if (extensionesOk.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Extension no valida',
            errors: {
                message: `Las extensiones válidas son: ${extensionesOk.join(', ')}`
            }
        });
    }

    // Nombre personalizado
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // Mover el archivo a un path
    const path = `./upload/${table}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al mover archivo',
                errors: err
            });
        }

        upForTable(table, id, nombreArchivo, res);
    });
}

const upForTable = (table, id, nameFile, res) => {
    if (table === 'usuarios') {
        Usuario.findById(id, (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'No existe un usuario con ese id',
                    errors: err
                });
            }

            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'No existe usuario'
                });
            }

            let pathOld = `./upload/usuarios/${usuarioDB.img}`;

            // Si existe, elimina la img anterior
            if (fs.existsSync(pathOld)) {
                fs.unlinkSync(pathOld);
            }

            usuarioDB.img = nameFile;

            usuarioDB.save((err, userDB) => {
                userDB.password = ':)';

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de usuario actualizada',
                    usuario: userDB
                });
            });
        });
    }

    if (table === 'medicos') {
        Medico.findById(id, (err, medicoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'No existe un medico con ese id',
                    errors: err
                });
            }

            if (!medicoDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'Médico no existe'
                });
            }

            let pathOld = `./upload/medicos/${medicoDB.img}`;

            // Si existe, elimina la img anterior
            if (fs.existsSync(pathOld)) fs.unlinkSync(pathOld);

            medicoDB.img = nameFile;

            medicoDB.save((err, medicDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de medico actualizada',
                    medico: medicDB
                });
            });
        });
    }

    if (table === 'hospitales') {
        Hospital.findById(id, (err, hospitalDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'No existe un hospital con ese id',
                    errors: err
                });
            }

            if (!hospitalDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'No existe hospital'
                });
            }

            let pathOld = `./upload/hospitales/${hospitalDB.img}`;

            // Si existe, elimina la img anterior
            if (fs.existsSync(pathOld)) fs.unlinkSync(pathOld);

            hospitalDB.img = nameFile;

            hospitalDB.save((err, hospDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de hospital actualizada',
                    hospital: hospDB
                });
            });
        });
    }
};