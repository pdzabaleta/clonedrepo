const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const utilities = require(".")

const validate = {};

/* ***************************************
 * Validation rules for adding classification
 ************************************** */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty().withMessage("Please provide a classification name.")
      .matches(/^[a-zA-Z0-9]+$/).withMessage("The classification name can only contain alphanumeric characters (no spaces or special characters).")
  ];
};

/* *******************************************
 * Check classification data and return errors or continue to add classification
 ******************************************** */
validate.checkClassificationData = async (req, res, next) => {
  // Obtener y transformar el valor ingresado
  let { classification_name } = req.body;
  classification_name = classification_name.charAt(0).toUpperCase() + classification_name.slice(1).toLowerCase();
  
  // Reemplazar el valor original para que la vista también lo reciba formateado
  req.body.classification_name = classification_name;

  // Ejecuta la validación de errores del express-validator
  let errors = validationResult(req);

  // Verifica si la clasificación ya existe (ahora con el valor normalizado)
  const classificationExists = await invModel.checkExistingClassification(classification_name);
  if (classificationExists) {
    req.flash('error', 'This classification already exists. Please choose a different name.');
    let nav = await utilities.getNav();
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      classification_name, // Se pasa el valor formateado
    });
  }

  // Si hay errores de validación, muestra el mensaje y re-renderiza
  if (!errors.isEmpty()) {
    req.flash('error', 'Please fix the errors above.');
    let nav = await utilities.getNav();
    return res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
  }

  // Si todo está correcto, continúa
  next();
};
module.exports = validate;
