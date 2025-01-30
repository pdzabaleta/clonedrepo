// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");

// Ruta para generar el error 500 intencionalmente
router.get("/login", utilities.handleErrors(accountController.buildLoginView))

  module.exports = router;