import express from "express";
import mongoose from "mongoose";

const app = express();

const mongodbURL = "mongodb://127.0.0.1:27017/hci_database";

mongoose.connect(mongodbURL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log(error);
    });

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
