const express = require('express');

const imageController = require('../controllers/images.controller');

const app = express();

// =====================
//        IMAGES
// =====================
app.get('/img/:table/:file', imageController.getImage);

module.exports = app;