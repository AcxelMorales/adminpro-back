const express = require('express');

const searchController = require('../controllers/search.controller');

const app = express();

// =====================
//     SEARCH ALL
// =====================
app.get('/search/all/:search', searchController.searchAll);

// =====================
//     SEARCH ONE
// =====================
app.get('/search/collection/:table/:search', searchController.searchOne);

module.exports = app;