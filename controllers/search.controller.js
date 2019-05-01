const Hospital = require('../models/Hospital.model');
const Medico = require('../models/Medico.model');
const Usuario = require('../models/Usuario.model');

// =======================
//  SEARCH ALL CONTROLLER
// =======================
exports.searchAll = (req, res) => {
    let search = req.params.search;
    let regex = new RegExp(search, 'i');

    Promise.all([
        searchHospitales(regex),
        searchMedicos(regex),
        searchUsuarios(regex)
    ]).then(respuestas => {
        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    }).catch(err => {
        res.status(500).json({
            ok: false,
            errors: err
        });
    });
}

// =======================
//  SEARCH FOR COLLECTION
// =======================
exports.searchOne = (req, res) => {
    let table = req.params.table;
    let search = req.params.search;
    let regex = new RegExp(search, 'i');
    let promise;

    switch (table) {
        case 'usuarios':
            promise = searchUsuarios(regex);
            break;

        case 'hospitales':
            promise = searchHospitales(regex);
            break;

        case 'medicos':
            promise = searchMedicos(regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                message: 'Los tipos de busqueda sólo son: usuarios, hospitales, medicos',
                error: {
                    message: 'Tipo de Tabla/Colección no válido'
                }
            });
            break;
    }

    promise.then(data => {
        res.status(200).json({
            ok: true,
            [table]: data
        });
    });
}

const searchHospitales = (regex) => {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex }).populate('usuario', 'nombre email').exec((err, hospitalesDB) => {
            if (err) reject('Error al cargar hospitales', err);
            else resolve(hospitalesDB);
        });
    });
};

const searchMedicos = (regex) => {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex }).populate('usuario', 'nombre email').exec((err, medicosDB) => {
            if (err) reject('Error al cargar medicos', err);
            else resolve(medicosDB);
        });
    });
};

const searchUsuarios = (regex) => {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role img').or([{ 'nombre': regex }, { 'email': regex }]).exec((err, usuariosDB) => {
            if (err) reject('Error al cargar usuarios', err);
            else resolve(usuariosDB);
        });
    });
};