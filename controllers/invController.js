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
  let nav = await utilities.getNav(req, res);
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
  let nav = await utilities.getNav(req, res);

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
      details, // Pass the HTML for vehicle details
      vehicle
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
  let nav = await utilities.getNav(req, res); 
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect
    // messages: req.flash(),
  });
};

/* ***************************
 *  Add Classification - Show Form
 * ************************** */
invCont.showAddClassificationForm = async (req, res) => {
  let nav = await utilities.getNav(req, res); 
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

// aqui empiez///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/* ***************************
 *  Show Add Inventory Form
 * *************************** */
invCont.showAddInventoryForm = async (req, res, next) => {
  try {
    let nav = await utilities.getNav(req, res);
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
    let nav = await utilities.getNav(req, res);

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

    // Construir el objeto del nuevo vehículo, convirtiendo a número los campos numéricos:
    const newVehicle = {
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      classification_id: Number(classification_id),
      inv_year: Number(inv_year),
      inv_price: Number(inv_price),
      inv_mileage: Number(inv_mileage)
    };

    // Insertar el vehículo en la base de datos
    const result = await invModel.addVehicle(newVehicle);

    if (result) {
      req.flash("success", "Vehicle added successfully.");
      return res.redirect("/inv");
    } else {
      req.flash("error", "Failed to add the vehicle. Please try again.");
      let classificationList = await utilities.buildClassificationList(classification_id);
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inventory_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************************
 * Render edit inventory view
 * *************************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav(req, res)
  const itemData = await invModel.getVehicleById(inventory_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inventory_id: itemData.inventory_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_mileage: itemData.inv_mileage,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Handle EDIT Inventory POST Request
 * *************************** */
invCont.updateInventory = async (req, res, next) => {
  try {
    let nav = await utilities.getNav(req, res);

    // Destructure form data from the request body
    const {
      inventory_id,
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

    // Construir el objeto del nuevo vehículo, convirtiendo a número los campos numéricos:
    const updateVehicle = {
      inventory_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      classification_id: Number(classification_id),
      inv_year: Number(inv_year),
      inv_price: Number(inv_price),
      inv_mileage: Number(inv_mileage)
    };

    // Insertar el vehículo en la base de datos
    const updateResult = await invModel.updateInventory(updateVehicle);

    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("success", `The ${itemName} was successfully updated.`)
      return res.redirect("/inv");
    } else {
      req.flash("error", "Failed to add the vehicle. Please try again.");
      let classificationSelect = await utilities.buildClassificationList(classification_id);
      const itemName = `${inv_make} ${inv_model}`
      return res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect,
        errors: [],
        flashMessage: req.flash("error"),
        inventory_id,
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

/* ***************************
 * Render delete confirmation view
 *************************** */
invCont.deleteInventoryView = async (req, res, next) => {
  try {
    const inventory_id = parseInt(req.params.inventory_id);
    const nav = await utilities.getNav(req, res);
    const itemData = await invModel.getVehicleById(inventory_id);
    if (!itemData) {
      throw new Error("Vehicle not found");
    }
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inventory_id: itemData.inventory_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Process deletion of an inventory item
 *************************** */
invCont.deleteInventory = async (req, res, next) => {
  try {
    const inventory_id = parseInt(req.body.inventory_id);
    const deleteResult = await invModel.deleteInventoryItem(inventory_id);
    
    // Aquí asumimos que deleteResult.rowCount indica el número de filas afectadas.
    if (deleteResult.rowCount && deleteResult.rowCount > 0) {
      req.flash("success", "Vehicle deleted successfully.");
      return res.redirect("/inv");
    } else {
      req.flash("error", "Failed to delete the vehicle. Please try again.");
      return res.redirect("/inv/delete/" + inventory_id);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
