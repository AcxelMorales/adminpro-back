const express = require('express');
const loginController = require('../controllers/login.controller');

const app = express();

// =====================
//        LOGIN
// =====================
app.post('/login', loginController.login);

// =====================
//    LOGIN GOOGLE
// =====================
app.post('/login/google', loginController.google)

module.exports = app;