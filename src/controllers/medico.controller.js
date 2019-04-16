const Medico = require('../models/Medico.model');

// ========================
//  GET Medicos CONTROLLER
// ========================
exports.getMedicos = (req, res) => {
    let since = req.query.since || 0;
    since = Number(since);

    Medico.find({})
        .skip(since)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error cargando medicos',
                    errors: err
                });
            }

            Medico.count({}, (err, count) => {
                res.status(200).json({
                    ok: true,
                    medicos: medicosDB,
                    total: count
                });
            });
        });
}

// ========================
//  POST Medico CONTROLLER
// ========================
exports.postMedico = (req, res) => {
    let body = req.body;

    let medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoSave) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al guardar un medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoSave
        });
    });
}

// =======================
//  PUT Medico CONTROLLER
// =======================
exports.putMedico = (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Medico.findById(id, (err, medicoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar un medico',
                errors: err
            });
        }

        if (!medicoDB) {
            return res.status(400).json({
                ok: false,
                message: `El medico con el id: ${id} no existe`,
                errors: {
                    message: 'No existe un medico con ese ID'
                }
            });
        }

        medicoDB.nombre = body.nombre;
        medicoDB.usuario = req.usuario._id;
        medicoDB.hospital = body.hospital;

        medicoDB.save((err, medicoSave) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoSave
            });
        });
    });
}

// ============================
//  DELETE Medico CONTROLLER
// ============================
exports.deleteMedico = (req, res) => {
    let id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoDelete) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar medico',
                errors: err
            });
        }

        if (!medicoDelete) {
            return res.status(400).json({
                ok: false,
                message: `El medico con el id: ${id} no existe`,
                errors: {
                    message: 'No existe un medico con ese ID'
                }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoDelete
        });
    });
}