// IMPORTS: User models, bcrypt, jsonwebtoken
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


/**
 * ROUTE: GET /api/users/current
 * DESCRIPTION: Displays the current user
 */
const currentUser = async (req, res) => {
    res.json(req.user);
}


/**
 * ROUTE: POST /api/users/register
 * DESCRIPTION: Register a user by taking the username and password values in the request body, checking if a user already exists
 *              with that username, and if not, hashes the password and creates a user in the database
 */
const registerUser = async (req, res, next) => {
    try {
        const {username, password} = req.body;

        // Data validation -- if either username or password is null, then don't accept the request
        if (!username || !password) {
            const err = new Error("Username and password are both required");
            err.statusCode = 400;
            throw err;
        }

        // Checks if there is already a user existing with the username in the request
        const existingUser = await User.findOne({username});
        if (existingUser) {
            const err = new Error(`User ${username} already exists`);
            err.statusCode = 400;
            throw err;
        }

        // Hashes the given password 10 times to be stored in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creates a new user in the database with the username and hashed password
        const newUser = await User.create({username, password: hashedPassword});
        res.status(201).json(newUser);
    } catch (err) {
        next(err);
    }
}

/**
 * ROUTE: POST /api/users/login
 * DESCRIPTION: Login a user by taking the username and password values in the request body and comparing it with the data in 
 *              the database
 */
const loginUser = async (req, res, next) => {
    try {
        const {username, password} = req.body;

        // Data validation -- if either username or password in the request body is null, then don't accept the request
        if (!username || !password) {
            const err = new Error("Username and password are both required");
            err.statusCode = 400;
            throw err;
        }

        const user = await User.findOne({username});

        // If a user exists with that username and the request password matches the hashed password in the database with that user,
        // then accept the request and log in the user
        if (user && (await bcrypt.compare(password, user.password))) {
            const accessToken = jwt.sign(
                {user: {username: user.username, id: user.id}},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: "7d"}
            );

            res.status(201).json({username: user.username, token: accessToken, id: user._id});
        }
        else {
            const err = new Error("Username or password is invalid");
            err.statusCode = 401;
            throw err;
        }
    } catch (err) {
        next(err);
    }
}


module.exports = {currentUser, registerUser, loginUser};