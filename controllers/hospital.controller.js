const Hospital = require('../models/Hospital.model');

// ===========================
//  GET Hospitales CONTROLLER
// ===========================
exports.getHospitales = (req, res) => {
    // let since = req.query.since || 0;
    // since = Number(since);

    Hospital.find({})
        // .skip(since)
        // .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, hospitalesDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error cargando hospitales',
                    errors: err
                });
            }

            Hospital.count({}, (err, count) => {
                res.status(200).json({
                    ok: true,
                    hospitales: hospitalesDB,
                    total: count
                });
            });
        });
}

// ============================
//  GET Hospital ID CONTROLLER
// ============================
exports.getHospital = (req, res) => {
    let id = req.params.id;

    Hospital.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, hospitalDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al buscar hospital',
                    errors: err
                });
            }

            if (!hospitalDB) {
                return res.status(400).json({
                    ok: false,
                    message: `El hospital con el ID: ${id} no existe`,
                    errors: {
                        message: 'No existe un hospital con ese ID'
                    }
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalDB
            });
        });
}

// ==========================
//  POST Hospital CONTROLLER
// ==========================
exports.postHospital = (req, res) => {
    let body = req.body;

    let hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalSave) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al guardar un hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalSave
        });
    });
}

// =========================
//  PUT Hospital CONTROLLER
// =========================
exports.putHospital = (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Hospital.findById(id, (err, hospitalDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar un hospital',
                errors: err
            });
        }

        if (!hospitalDB) {
            return res.status(400).json({
                ok: false,
                message: `El hospital con el id: ${id} no existe`,
                errors: {
                    message: 'No existe un hospital con ese ID'
                }
            });
        }

        hospitalDB.nombre = body.nombre;
        hospitalDB.usuario = req.usuario._id;

        hospitalDB.save((err, hospitalSave) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalSave
            });
        });
    });
}

// ============================
//  DELETE Hospital CONTROLLER
// ============================
exports.deleteHospital = (req, res) => {
    let id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalDelete) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar hospital',
                errors: err
            });
        }

        if (!hospitalDelete) {
            return res.status(400).json({
                ok: false,
                message: `El hospital con el id: ${id} no existe`,
                errors: {
                    message: 'No existe un hospital con ese ID'
                }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalDelete
        });
    });
}