const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true })
    .then(() => console.log("Base de datos:\x1b[32m%s\x1b[0m", " online"))
    .catch(err => console.error(err));

app.use(require('./routes/login.routes'));
app.use(require('./routes/usuario.routes'));
app.use(require('./routes/hospital.routes'));
app.use(require('./routes/medico.routes'));
app.use(require('./routes/search.routes'));
app.use(require('./routes/upload.routes'));
app.use(require('./routes/images.routes'));
app.use(require('./routes/routes'));

app.listen(3000, () => console.log('Escuchando en el puerto:\x1b[36m%s\x1b[0m', ' 3000'));