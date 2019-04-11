const express = require('express');
const auth = require('../middlewares/auth');

const usuarioController = require('../controllers/usuario.controller');

const app = express();

// =====================
//         GET
// =====================
app.get('/usuario', usuarioController.getUsuarios);

// =====================
//         POST
// =====================
app.post('/usuario', auth.verifyToken, usuarioController.postUsuario);

// =====================
//         PUT
// =====================
app.put('/usuario/:id', auth.verifyToken, usuarioController.putUsuario);

// =====================
//       DELETE
// =====================
app.delete('/usuario/:id', auth.verifyToken, usuarioController.deleteUsuario);

module.exports = app;