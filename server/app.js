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

app.post('/getTickerImage', (req, res) => {
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

        const latestPatternMatch = stdout.match(/latestPattern\[(.+?)\]/); // Use .+? to match any character including spaces
        const patternTypeMatch = stdout.match(/patternType\[(\w+)\]/); // \w matches any word character (equivalent to [a-zA-Z0-9_])
        const successRateMatch = stdout.match(/successRate\[(\d+)%\]/); // Match digits followed by a %

        // Extracting the numeric values
        const open = openMatch ? parseFloat(openMatch[1]) : null;
        const close = closeMatch ? parseFloat(closeMatch[1]) : null;
        const high = highMatch ? parseFloat(highMatch[1]) : null;
        const low = lowMatch ? parseFloat(lowMatch[1]) : null;

        // Extracting the values
        const latestPattern = latestPatternMatch ? latestPatternMatch[1] : null;
        const patternType = patternTypeMatch ? patternTypeMatch[1] : null;
        const successRate = successRateMatch ? parseInt(successRateMatch[1], 10) : null; // Parse the percentage as an integer

        console.log(`Open: ${open}, Close: ${close}, High: ${high}, Low: ${low}`);
        console.log(`Latest Pattern: ${latestPattern}, Pattern Type: ${patternType}, Success Rate: ${successRate}`);

        const lastOHLC = {  open: open, 
                            close: close, 
                            high: high, 
                            low: low };

        const prediction = { latestPattern: latestPattern,
                             patternType: patternType,
                             successRate: successRate };

        db.collection('users')
            .updateOne(
                { email: req.body.email, username: req.body.username }, // Find a document match
                { $set: { lastOHLC: lastOHLC, prediction: prediction } }, // Update the surveyData field
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
        return
    });
    
    // Set a timeout to kill the process if it runs longer than 5 seconds
    const killTimeout = setTimeout(() => {
        if (!child.killed) {
            console.log('MATLAB script did not finish in time. Killing the process.');
            child.kill(); // This sends SIGTERM signal
        }
    }, 15000); // Adjust
});

app.post('/getTickerData', (req, res) => {
    console.log("Getting latest OHLC data");

    db.collection('users')
        .findOne({ email: req.body.email, username: req.body.username })
        .then((user) => {
            if (user) {
                res.status(200).json({ lastOHLC: user.lastOHLC, prediction: user.prediction });
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

                if (user.surveyData) {
                    return res.send({ message: "Username already exists", doneSurvey: true });
                }

                return res.send({ message: "Username already exists", doneSurvey: false });
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

app.post("/populateBank", (req, res) => {
    console.log("Populating bank with: ", req.body.ticker);

    db.collection('tickerBank')
        .updateOne(
            { ticker: req.body.ticker }, // Find a document match
            { $set: { bank: req.body.bank } }, // Update the bank field
            { upsert: true } // Option to insert a new document if no match is found
        )
        .then(result => {
            // You can customize your response based on the result if needed
            console.log("Bank updated successfully");
            res.status(200).json({ message: "Bank updated successfully" });
        })
        .catch(err => {
            console.error("Error updating bank:", err);
            res.status(500).json({ message: "Failed to update bank" });
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