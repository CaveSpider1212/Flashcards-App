// IMPORTS: express and user controllers
const express = require("express");
const {registerUser, loginUser} = require("../controllers/userController");

// CREATE ROUTER
const router = express.Router();

// ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

// EXPORTS: router
module.exports = router;