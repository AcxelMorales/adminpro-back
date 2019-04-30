const express = require('express');
const fileUpload = require('express-fileupload');

const uploadController = require('../controllers/upload.controller');

const app = express();

app.use(fileUpload());

// =====================
//        UPLOAD
// =====================
app.put('/upload/:table/:id', uploadController.uploadImage);

module.exports = app;