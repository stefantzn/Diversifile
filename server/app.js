require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { connectToDb, getDb } = require('./db');

const app = express();
const PORT = 5001 || process.env.PORT;

let db;

console.log("Starting")

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send("Hello from the server");
});

app.post('/storeUserSurvey', (req, res) => {
    console.log("Running MATLAB script")
    console.log(req.body);
    res.send("Hello from the server 2");
});

app.get('/getSurveyData', (req, res) => {
    let surveyData = [];

    console.log("Getting survey data");
    db.collection('users')
        .find()
        .forEach(user => surveyData.push(user))
        .then(() => {
            res.status(200).json(surveyData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Could not fetch survey data" })
        });
});

connectToDb((err) => {
    if (!err) {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        db = getDb();
    }
});