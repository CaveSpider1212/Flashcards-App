// IMPORTS: jsonwebtoken
const jwt = require("jsonwebtoken");


/**
 * DESCRIPTION: Validates that the access token generated when a user logs in is valid; used to determine if user is logged
 *              in or not, which allows them to do certain functions (create deck, create flashcards, etc.)
 * 
 * USED IN: All deck and flashcard functions
 */
const validateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Checks if either authHeader doesn't exist or if it does but does not start with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        const err = new Error("No token provided");
        err.statusCode = 401;
        throw err;
    }

    // Gets the access token from authHeader
    const token = authHeader.split(" ")[1];

    try {
        // Verifies that the access token is valid, and if so, sets the request user to the user associated with the token (decoded)
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // throws an error if verify is unsuccessful
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({message: "User not authorized or token is invalid"});
    }
}


// EXPORTS: validateToken
module.exports = validateToken;