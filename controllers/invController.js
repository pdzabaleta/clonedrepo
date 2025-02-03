const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Get vehicle details by ID
 * ************************** */
invCont.getVehicleDetails = async function (req, res, next) {
  const { inventoryId } = req.params; // Get the vehicle ID from the URL
  let nav = await utilities.getNav();

  try {
    // Fetch vehicle details from the model
    const vehicle = await invModel.getVehicleById(inventoryId);

    if (!vehicle) {
      return res.status(404).send('Vehicle not found');
    }

    // Build vehicle details HTML
    const details = utilities.buildVehicleDetails(vehicle);

    // Render the view with the vehicle details
    res.render('inventory/details', { 
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      details // Pass the HTML for vehicle details
    });

  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};

/* ***************************
 *  Show Inventory Management View

The key is the line res.render("inventory/management", {...}), 
which tells Express to use the management.ejs view inside the views/inventory/ folder.
 * ************************** */
invCont.showManagementView = async (req, res) => {
  let nav = await utilities.getNav(); 
  res.render("inventory/management", {
    title: "Inventory Management",
    nav, 
    messages: req.flash(),
  });
};

module.exports = invCont;
