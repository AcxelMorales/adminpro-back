const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true })
    .then(() => console.log("Base de datos: \x1b[32m%s\x1b[0m", " online"))
    .catch(err => console.error(err));

app.use(require('../routes/routes'));

app.listen(3000, () => console.log('Escuchando en el puerto:\x1b[36m', '3000'));