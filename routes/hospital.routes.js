const express = require('express');
const auth = require('../middlewares/auth');

const hospitalController = require('../controllers/hospital.controller');

const app = express();

// =====================
//         GET
// =====================
app.get('/hospital', hospitalController.getHospitales);

// =====================
//         POST
// =====================
app.post('/hospital', auth.verifyToken, hospitalController.postHospital);

// =====================
//         PUT
// =====================
app.put('/hospital/:id', auth.verifyToken, hospitalController.putHospital);

// =====================
//       DELETE
// =====================
app.delete('/hospital/:id', auth.verifyToken, hospitalController.deleteHospital);

module.exports = app;