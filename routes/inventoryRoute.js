const express = require("express");
const router = express.Router();
const utilities = require("../utilities/"); // Requerido para 'handleErrors' y 'getNav'
const invController = require("../controllers/invController");
const validate = require("../utilities/classificationValidation"); // Requerido para las validaciones
const inventoryValidation = require("../utilities/inventoryValidation");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// route to get vehicle details
router.get("/vehicle/:inventoryId", utilities.handleErrors(invController.getVehicleDetails));

// route for inventory management
router.get("/", utilities.handleErrors(invController.showManagementView));

// Route to show the add classification form
router.get("/add-classification", utilities.handleErrors(invController.showAddClassificationForm));

// route for classification 
router.post("/add-classification", validate.classificationRules(), validate.checkClassificationData, utilities.handleErrors(invController.addClassification));

// Route to display the add inventory form
router.get("/add-inventory",  utilities.handleErrors(invController.showAddInventoryForm));

// Route to process the add inventory form submission
router.post(
    "/add-inventory",
    inventoryValidation.inventoryRules(),
    inventoryValidation.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
  );
module.exports = router;
