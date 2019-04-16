const path = require('path');
const fs = require('fs');

// =======================
//  GET Image CONTROLLER
// =======================
exports.getImage = (req, res) => {
    let table = req.params.table;
    let file = req.params.file;

    let pathImg = path.resolve(__dirname, `../uploads/${table}/${file}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }
};