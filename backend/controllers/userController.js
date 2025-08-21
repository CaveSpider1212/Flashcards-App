// IMPORTS: User models, bcrypt, jsonwebtoken
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


/**
 * ROUTE: GET /api/users/current
 * DESCRIPTION: Displays the current user
 */
const currentUser = async (req, res) => {
    /**
     * Request user: Logged-in user
     */

    // returns a JSON of the current user information (ID, username, etc.) if found
    res.json(req.user);
}


/**
 * ROUTE: POST /api/users/register
 * DESCRIPTION: Register a user by taking the username and password values in the request body, checking if a user already exists
 *              with that username, and if not, hashes the password and creates a user in the database
 */
const registerUser = async (req, res, next) => {
    try {
        /**
         * Request body: Username, Password
         */
        const {username, password} = req.body;

        // Data validation -- if either username or password is null, then throw an error and don't accept the request
        if (!username || !password) {
            const err = new Error("Username and password are both required");
            err.statusCode = 400;
            throw err;
        }

        // Checks if there is already a user existing with the username in the request (if so, throw an error)
        const existingUser = await User.findOne({username});
        if (existingUser) {
            const err = new Error(`User ${username} already exists`);
            err.statusCode = 400;
            throw err;
        }

        // Hashes the given password 10 times to be stored in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creates a new user in the database with the username and hashed password and returns the username and password as a JSON
        const newUser = await User.create({username, password: hashedPassword});
        res.status(201).json(newUser);
    } catch (err) {
        next(err); // passes error to error handling middleware
    }
}

/**
 * ROUTE: POST /api/users/login
 * DESCRIPTION: Login a user by taking the username and password values in the request body and comparing it with the data in 
 *              the database
 */
const loginUser = async (req, res, next) => {
    try {
        /**
         * Request body: Username, Password
         */
        const {username, password} = req.body;

        // Data validation -- if either username or password in the request body is null, then throw and error and don't accept the request
        if (!username || !password) {
            const err = new Error("Username and password are both required");
            err.statusCode = 400;
            throw err;
        }

        // finds a user with a username value the same as the username found in the request body
        const user = await User.findOne({username});

        // If a user exists with that username and the request password matches the hashed password in the database with that user,
        // then accept the request and log in the user (otherwise, throw an error)
        if (user && (await bcrypt.compare(password, user.password))) {
            const accessToken = jwt.sign(
                {user: {username: user.username, id: user.id}},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: "7d"}
            );

            // returns a JSON of the username, token, and user ID
            res.status(201).json({username: user.username, token: accessToken, id: user._id});
        }
        else {
            const err = new Error("Username or password is invalid");
            err.statusCode = 401;
            throw err;
        }
    } catch (err) {
        next(err); // passes error to error handling middleware
    }
}


module.exports = {currentUser, registerUser, loginUser};