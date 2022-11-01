/*=== Database ===*/
require("dotenv").config();
const {DB} = require("./database");
DB.connect();

/*=== Express ===*/
const express = require("express");
const path = require("path");
const app = express();
// Middleware stuff
app.use(express.json());
app.use(express.urlencoded());

// For client-side access (HTML, CSS, JS, Images, Public PDFs, Fonts, etc.)
app.use('/public', express.static('public'));

// Home endpoint
app.get('/', (req, res) => {
    // TODO
});

// Survey post result
app.post('/survey', (req, res) => {
    let data = req.body;
    // TODO
});

// Survey lookup endpoint
app.get('/survey/:id', (req, res) => {
    // Unique identifier for result lookup
    let id = req.params.id;
    // TODO Lookup and send html or pdf
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log("Access at port: " + PORT);
});
