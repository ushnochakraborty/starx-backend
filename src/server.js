/*=== Database ===*/
require("dotenv").config();
const {DB} = require("./database");
// DB.connect(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS);

/*=== Express ===*/
const express = require("express");
const path = require("path");
const app = express();
// Middleware stuff
app.use(express.json());

const ENDPOINTS = {
    SURVEY_GET: '/survey',
    SURVEY_POST: '/survey',
};

/**
 * @typedef {{
 * q1: Number,
 * q2: Number,
 * q3: Number,
 * q4: Number,
 * q5: Number,
 * q6: Number,
 * q7: Number,
 * q8: Number,
 * q9: Number,
 * q10: Number,
 * q11: Number,
 * q12: Number,
 * q13: Number,
 * q14: Number,
 * q15: Number,
 * q16: Number,
 * q17: Number,
 * q18: Number,
 * }} SurveyData
 */

// For client-side access (HTML, CSS, JS, Images, Public PDFs, Fonts, etc.)
app.use('/public', express.static('public'));

// Survey post result
app.post(`${ENDPOINTS.SURVEY_POST}`, async (req, res) => {
    let data = req.body.data;
    let uid = req.body.uid;
    let pin = req.body.pin;

    if (uid && pin) {
        let status = DB.upload(uid, pin, data);
        switch (status) {
            case 'ok': res.status(200).send("Uploaded"); break;
            case 'auth': res.status(401).send("Unauthorized"); break;
            case 'db': res.status(503).send("Database error"); break;
            default: res.status(500).send("Error");
        }
        return;
    }

    let status = DB.uploadNew(data);
    if (status === 'db') {
        res.status(503).send("Database error");
        return;
    }
    res.status(201).send(status);
});

// // Survey lookup endpoint
// app.get(`${ENDPOINTS.SURVEY_GET}`, async (req, res) => {
//     let uid = req.body.uid;
//     let pin = req.body.pin;
//     if (!uid || !pin) {
//         res.status(401).send("No auth");
//         return;
//     }
//     let data = await DB.get(id, pin);
//     if (!data) {
//         res.sendStatus(401);
//         return;
//     }
//     res.status(200).json(data);
// });

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log("Access at port: " + PORT);
});
