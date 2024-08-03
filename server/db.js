const { MongoClient } = require('mongodb');

let dbConnection;
const uri = "mongodb+srv://Diversifile:Diversifile@cluster0.dp2we8i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(uri)
            .then((client) => {
                console.log("Connected to MongoDB");
                dbConnection = client.db("diversifile");
                return cb();
            })
            .catch((err) => {
                console.log(err);
                return cb(err);
            });
    },
    getDb: () => dbConnection
}