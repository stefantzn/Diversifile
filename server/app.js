require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { connectToDb, getDb } = require('./db');

const { exec } = require('child_process');
const path = require('path');

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
    const { email, username, surveyData } = req.body;

    db.collection('users')
        .updateOne(
            { email: email, username: username }, // Find a document match
            { $set: { surveyData: surveyData } }, // Update the surveyData field
            { upsert: true } // Option to insert a new document if no match is found
        )
        .then(result => {
            // You can customize your response based on the result if needed
            console.log("Survey data updated successfully");
            res.status(200).json({ message: "Survey data updated successfully" });
        })
        .catch(err => {
            console.error("Error updating survey data:", err);
            res.status(500).json({ message: "Failed to update survey data" });
        });


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

app.post('/getTicker', (req, res) => {
    console.log("Getting ticker");

    // console.log(req.body)

    const company = req.body.ticker;

    // const child = exec(`/Applications/MATLAB_R2024a.app/bin/matlab -nodisplay -nosplash -r "run('Candlestick_Analysis.m'); exit;"`, (error, stdout, stderr) => {
    const child = exec(`/Applications/MATLAB_R2024a.app/bin/matlab -nodisplay -nosplash -r "Candlestick_Analysis_Polygon('${company}'); exit;"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing MATLAB script: ${error.message}`);
          return; // Removed res.status(500).send('Error running MATLAB script') to focus on the child process handling
        }
        console.log(`MATLAB stdout: ${stdout}`);

        // Regular expressions to match the patterns
        const openMatch = stdout.match(/open\[(\d+\.\d+)\]/);
        const closeMatch = stdout.match(/close\[(\d+\.\d+)\]/);
        const highMatch = stdout.match(/high\[(\d+\.\d+)\]/);
        const lowMatch = stdout.match(/low\[(\d+\.\d+)\]/);

        // Extracting the numeric values
        const open = openMatch ? parseFloat(openMatch[1]) : null;
        const close = closeMatch ? parseFloat(closeMatch[1]) : null;
        const high = highMatch ? parseFloat(highMatch[1]) : null;
        const low = lowMatch ? parseFloat(lowMatch[1]) : null;

        console.log(`Open: ${open}, Close: ${close}, High: ${high}, Low: ${low}`);

        const lastOHLC = {  open: open, 
                            close: close, 
                            high: high, 
                            low: low };

        db.collection('users')
            .updateOne(
                { email: req.body.email, username: req.body.username }, // Find a document match
                { $set: { lastOHLC: lastOHLC } }, // Update the surveyData field
                { upsert: true } // Option to insert a new document if no match is found
            )
            .then(result => {
                // You can customize your response based on the result if needed
                console.log("Database updated successfully with latest OHLC data");
            })
            .catch(err => {
                console.error("Error updating database:", err);
            });

        if (stdout.includes("No data available for the given date range")) {
            // console.log("No data available for the given date range.");
            // Handle the case when no data is available, e.g., send a specific response
            res.status(204).send("No data available for the given date range.");
            clearTimeout(killTimeout);
            return; // Exit the callback to prevent further execution
        }

        // console.error(`MATLAB stderr: ${stderr}`);
        // Assuming res.sendFile(outputImage) is part of a larger application logic not shown here
        res.sendFile(path.join(__dirname, 'plot.png'), (err) => {
            if (err) {
                console.log(err);
                res.status(500).send('Failed to send the image');
            } else {
                console.log('Image sent successfully');
            }
        });
        clearTimeout(killTimeout); 
    });
    
    // Set a timeout to kill the process if it runs longer than 5 seconds
    const killTimeout = setTimeout(() => {
        if (!child.killed) {
            console.log('MATLAB script did not finish in time. Killing the process.');
            child.kill(); // This sends SIGTERM signal
        }
    }, 15000); // Adjust
});

app.post('/getLatestOHLC', (req, res) => {
    console.log("Getting latest OHLC data");

    db.collection('users')
        .findOne({ email: req.body.email, username: req.body.username })
        .then((user) => {
            if (user) {
                res.status(200).json(user.lastOHLC);
            } else {
                res.status(204).json({ message: "No user found" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Error fetching latest OHLC data" });
        });
});

app.post("/createUser", (req, res) => {
    console.log("Creating user");
    console.log(req.body);
    
    // Check if the username already exists
    db.collection('users').findOne({ username: req.body.username, email: req.body.email })
        .then((user) => {
            if (user) {
                // If a user with the same username is found, return a 409 Conflict status
                console.log("Username already exists");
                return res.status(204).json({ message: "Username already exists" });
            }
            // If no user is found, proceed to create a new user
            db.collection('users')
                .insertOne(req.body)
                .then(() => {
                    res.status(201).json({ message: "User created" });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ message: "Could not create user" });
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Error checking for existing user" });
        });
})


connectToDb((err) => {
    if (!err) {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        db = getDb();
    }
});