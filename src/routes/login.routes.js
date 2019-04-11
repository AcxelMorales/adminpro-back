const express = require('express');
const loginController = require('../controllers/login.controller');

const app = express();

// =====================
//  LOGIN
// =====================
app.post('/login', loginController.login);

module.exports = app;