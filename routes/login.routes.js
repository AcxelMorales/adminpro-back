const express = require('express');
const loginController = require('../controllers/login.controller');

const auth = require('../middlewares/auth');

const app = express();

// =====================
//        LOGIN
// =====================
app.post('/login', loginController.login);

// =====================
//    LOGIN GOOGLE
// =====================
app.post('/login/google', loginController.google);

// =====================
//    RENEW TOKEN
// =====================
app.get('/login/renewtoken', auth.verifyToken, loginController.renewToken);

module.exports = app;