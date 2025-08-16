// IMPORTS: express, cors, dotenv, mongoose, connectDb
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config(); // reads .env file
connectDB(); // calls connectDB() function, which connects to MongoDB database

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.json());

// ADD ROUTES TO APP
app.use("/api/decks", require("./routes/deckRoutes"));
app.use("/api/flashcards", require("./routes/flashcardRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// ERROR HANDLING
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})