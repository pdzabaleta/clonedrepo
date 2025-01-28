// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// route to get vehicle details
router.get("/vehicle/:inventoryId", invController.getVehicleDetails);

module.exports = router;
