// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");

router.get("/login", utilities.handleErrors(accountController.buildLoginView))

router.get("/register", utilities.handleErrors(accountController.buildRegisterView))
router.post("/register", utilities.handleErrors(accountController.registerAccount))
 
module.exports = router;