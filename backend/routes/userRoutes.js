// IMPORTS: express, user controller, authentication middleware
const express = require("express");
const {currentUser, registerUser, loginUser} = require("../controllers/userController");
const validateToken = require("../middleware/authentication");

// CREATE ROUTER
const router = express.Router();

// ROUTES
router.get("/current", validateToken, currentUser); // requires user authentication/login
router.post("/register", registerUser);
router.post("/login", loginUser);

// EXPORTS: router
module.exports = router;