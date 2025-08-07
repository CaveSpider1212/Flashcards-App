const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING); // connects backend to database using CONNECTION_STRING
        console.log(`Connected to database: ${mongoose.connection.name}`);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;