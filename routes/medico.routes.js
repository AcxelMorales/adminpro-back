const express = require('express');
const auth = require('../middlewares/auth');

const medicoController = require('../controllers/medico.controller');

const app = express();

// =====================
//         GET
// =====================
app.get('/medico', medicoController.getMedicos);

// =====================
//         POST
// =====================
app.post('/medico', auth.verifyToken, medicoController.postMedico);

// =====================
//         PUT
// =====================
app.put('/medico/:id', auth.verifyToken, medicoController.putMedico);

// =====================
//       DELETE
// =====================
app.delete('/medico/:id', auth.verifyToken, medicoController.deleteMedico);

module.exports = app;