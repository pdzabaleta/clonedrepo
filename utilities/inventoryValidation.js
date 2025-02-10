const { body, validationResult } = require("express-validator");
// const invModel = require("../models/inventory-model");
const utilities = require("./"); // Para getNav() y buildClassificationList() si lo necesitas

const inventoryValidation = {};

/* ***************************************
 * Reglas de validación para agregar inventario
 ***************************************/
inventoryValidation.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty().withMessage("Make is required."),
    body("inv_model")
      .trim()
      .notEmpty().withMessage("Model is required."),
    body("inv_description")
      .trim()
      .notEmpty().withMessage("Description is required."),
    body("inv_image")
      .trim()
      .notEmpty().withMessage("Image URL is required."),
    body("inv_thumbnail")
      .trim()
      .notEmpty().withMessage("Thumbnail URL is required."),
    body("classification_id")
      .trim()
      .notEmpty().withMessage("Classification is required."),
    body("inv_year")
      .notEmpty().withMessage("Year is required.")
      .isInt({ min: 1886 }).withMessage("A valid year (>=1886) is required."),
    body("inv_price")
      .notEmpty().withMessage("Price is required.")
      .isFloat({ min: 0 }).withMessage("Price must be a number greater than or equal to 0."),
    body("inv_mileage")
      .notEmpty().withMessage("Mileage is required.")
      .isFloat({ min: 0 }).withMessage("Mileage must be a number greater than or equal to 0.")
  ];
};

/* ***************************************
 * Reglas de validación eliminar inventario
 ***************************************/

inventoryValidation.deleteRules = () => {
  return [
    body("inventory_id")
      .notEmpty().withMessage("Vehicle ID is required.")
      .isInt().withMessage("Vehicle ID must be a number.")
  ];
};

/* *******************************************
 * Verificar datos de inventario y enviar errores mediante flash
 ********************************************/
inventoryValidation.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Unir todos los mensajes de error en una cadena
    const errorMsgs = "<ul>" + errors.array().map(e => `<li>${e.msg}</li>`).join("") + "</ul>";
    req.flash("error", errorMsgs);
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(req.body.classification_id);
    return res.status(400).render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: errors.array(),
        inv_make: req.body.inv_make,
        inv_model: req.body.inv_model,
        inv_description: req.body.inv_description,
        inv_image: req.body.inv_image,
        inv_thumbnail: req.body.inv_thumbnail,
        inv_year: req.body.inv_year,
        inv_price: req.body.inv_price,
        inv_mileage: req.body.inv_mileage
      });
      
  }
  next();
};

/* *******************************************
 *  errors will be directed back to the edit view
 ********************************************/
inventoryValidation.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Unir todos los mensajes de error en una cadena
    const errorMsgs = "<ul>" + errors.array().map(e => `<li>${e.msg}</li>`).join("") + "</ul>";
    req.flash("error", errorMsgs);
    let nav = await utilities.getNav();
    let classificationSelect = await utilities.buildClassificationList(req.body.classification_id);
    return res.status(400).render("inventory/edit-inventory", {
        title: "Modify New Vehicle",
        nav,
        classificationSelect,
        errors: errors.array(),
        intentory_id: req.body.inventory_id,
        inv_make: req.body.inv_make,
        inv_model: req.body.inv_model,
        inv_description: req.body.inv_description,
        inv_image: req.body.inv_image,
        inv_thumbnail: req.body.inv_thumbnail,
        inv_year: req.body.inv_year,
        inv_price: req.body.inv_price,
        inv_mileage: req.body.inv_mileage
      });
      
  }
  next();
};

/* *******************************************
 *  errors will be directed back to the delete view
 ********************************************/
inventoryValidation.checkDeleteData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Unir todos los mensajes de error en una cadena
    const errorMsgs = "<ul>" + errors.array().map(e => `<li>${e.msg}</li>`).join("") + "</ul>";
    req.flash("error", errorMsgs);
    let nav = await utilities.getNav();
    let classificationSelect = await utilities.buildClassificationList(req.body.classification_id);
    return res.status(400).render("inventory/delete-confirm", {
        title: "Delete Vehicle", // Título para la vista de eliminación
        nav,
        classificationSelect,
        errors: errors.array(),
        inventory_id: req.body.inventory_id,
        inv_make: req.body.inv_make,
        inv_model: req.body.inv_model,
        inv_year: req.body.inv_year,
        inv_price: req.body.inv_price
    });
  }
  next();
};


module.exports = inventoryValidation;
