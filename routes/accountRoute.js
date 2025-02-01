// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountController.buildLoginView))

router.get("/register", utilities.handleErrors(accountController.buildRegisterView))
// Process the registration data
router.post("/register",regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount)
  )
 // Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)
module.exports = router;