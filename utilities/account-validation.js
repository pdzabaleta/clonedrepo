const utilities = require(".") 
const { body, validationResult } = require("express-validator") 

const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  
  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
// Check Registration Data
validate.checkRegData = async (req, res, next) => {
    const errors = validationResult(req); // Usamos directamente validationResult aquí
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        // Asegúrate de pasar los errores como un array y no como un objeto complejo
        res.render("account/register", {
            errors: errors.array(), // Usamos errors.array() para obtener los errores en formato de array
            title: "Registration",
            nav,
            account_firstname: req.body.account_firstname,
            account_lastname: req.body.account_lastname,
            account_email: req.body.account_email,
        });
        return;
    }
    next(); // Si no hay errores, pasamos al siguiente middleware
};

  
  module.exports = validate