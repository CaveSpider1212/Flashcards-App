const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/decks", require("./routes/deckRoutes"));
app.use("/api/flashcards", require("./routes/flashcardRoutes"));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})