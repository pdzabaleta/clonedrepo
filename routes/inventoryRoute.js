// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const utilities = require("../utilities/");
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// route to get vehicle details
router.get("/vehicle/:inventoryId", invController.getVehicleDetails);

// rute for inventory management
router.get("/", utilities.handleErrors(invController.showManagementView));

module.exports = router;
