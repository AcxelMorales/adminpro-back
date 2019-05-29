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
app.post('/usuario' , usuarioController.postUsuario);

// =====================
//         PUT
// =====================
app.put('/usuario/:id', [auth.verifyToken, auth.verifyADMIN_o_MismoUsuario], usuarioController.putUsuario);

// =====================
//       DELETE
// =====================
app.delete('/usuario/:id', [auth.verifyToken, auth.verifyADMIN_ROLE], usuarioController.deleteUsuario);

module.exports = app;