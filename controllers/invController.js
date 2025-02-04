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
    nav
    // messages: req.flash(),
  });
};

/* ***************************
 *  Add Classification - Show Form
 * ************************** */
invCont.showAddClassificationForm = async (req, res) => {
  let nav = await utilities.getNav(); 
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    classification_name: "",  // Valor por defecto vacío
  });
};

/* ***************************
 *  Add Classification - Handle POST request
 * ************************** */
invCont.addClassification = async (req, res, next) => {
  let { classification_name } = req.body;
  // Asegúrate de normalizar (aunque ya se hizo en el middleware)
  classification_name = classification_name.charAt(0).toUpperCase() + classification_name.slice(1).toLowerCase();

  try {
    await invModel.addClassification(classification_name);
    req.flash("success", "Classification added successfully.");
    res.redirect("/inv");
  } catch (error) {
    req.flash("error", "There was an error adding the classification.");
    res.redirect("/inv/add-classification");
  }
};


/* ***************************
 *  Show Add Inventory Form
 * *************************** */
invCont.showAddInventoryForm = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    // Build the classification list (the <select> element) from the utility
    const classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      // Sticky field values (initial/default values)
      inv_make: "",
      inv_model: "",
      inv_description: "",
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image-tn.png",
      inv_year: "",
      inv_price: "",
      inv_mileage: "",
      flashMessage: "",
      errors: []
    });
  } catch (error) {
    console.error("Error displaying add inventory form:", error);
    next(error);
  }
};

/* ***************************
 *  Handle Add Inventory POST Request
 * *************************** */
invCont.addInventory = async (req, res, next) => {
  try {
    let nav = await utilities.getNav();

    // Destructure form data from the request body
    const {
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      classification_id,
      inv_year,
      inv_price,
      inv_mileage
    } = req.body;

    // Basic server-side validation – adjust as needed
    const errors = [];
    if (!inv_make || inv_make.trim() === "") {
      errors.push({ msg: "Make is required." });
    }
    if (!inv_model || inv_model.trim() === "") {
      errors.push({ msg: "Model is required." });
    }
    if (!inv_description || inv_description.trim() === "") {
      errors.push({ msg: "Description is required." });
    }
    if (!inv_image || inv_image.trim() === "") {
      errors.push({ msg: "Image URL is required." });
    }
    if (!inv_thumbnail || inv_thumbnail.trim() === "") {
      errors.push({ msg: "Thumbnail URL is required." });
    }
    if (!classification_id || classification_id.trim() === "") {
      errors.push({ msg: "Classification is required." });
    }
    if (!inv_year || isNaN(inv_year) || Number(inv_year) < 1886) {
      errors.push({ msg: "A valid year (>=1886) is required." });
    }
    if (!inv_price || isNaN(inv_price) || Number(inv_price) < 0) {
      errors.push({ msg: "Price must be a number greater than or equal to 0." });
    }
    if (!inv_mileage || isNaN(inv_mileage) || Number(inv_mileage) < 0) {
      errors.push({ msg: "Mileage must be a number greater than or equal to 0." });
    }

    // Rebuild classification list with the selected classification (if any)
    const classificationList = await utilities.buildClassificationList(classification_id);

    // If errors exist, re-render the form with errors and sticky values
    if (errors.length > 0) {
      return res.status(400).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors,
        flashMessage: "",
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_year,
        inv_price,
        inv_mileage
      });
    }

    // Build the new vehicle object
    const newVehicle = {
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      classification_id,
      inv_year,
      inv_price,
      inv_mileage
    };

    // Insert the new vehicle using the model function
    // const result = await invModel.addVehicle(newVehicle);
    if (result) {
      await invModel.addVehicle(newVehicle);
      req.flash("success", "Vehicle added successfully.");
      // Redirect to your inventory management view or main inventory page (adjust the route as needed)
      return res.redirect("/inv");
    } else {
      req.flash("error", "Failed to add the vehicle. Please try again.");
      return res.status(400).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: [],
        flashMessage: req.flash("error"),
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_year,
        inv_price,
        inv_mileage
      });
    }
  } catch (error) {
    console.error("Error adding vehicle:", error);
    next(error);
  }
};

module.exports = invCont;
