const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const accountModel = require("../models/account-model")
  const jwt = require('jsonwebtoken');
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
  
// valid email is required and cannot already exist in the database
body("account_email")
  .trim()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid email is required.")
  .custom(async (account_email) => {
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists){
      throw new Error("Email exists. Please log in or use different email")
    }
  }),
  
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
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav(req, res)
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }
  
/* ******************************
 * Login Validation Rules
 * ***************************** */
validate.loginRules = () => [
  body("account_email")
    .isEmail()
    .withMessage("A valid email is required.")
    .normalizeEmail(),

  body("account_password")
    .notEmpty()
    .withMessage("Password is required.")
]

/* ******************************
* Check login data and return errors or continue
* ***************************** */
validate.checkLoginData = async (req, res, next) => {
  // console.log("Login Request Body:", req.body);

  const errors = validationResult(req)
  // console.log("Validation Errors:", errors.array());

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav(req, res)
    req.flash("error", "Login failed. Please check the form and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email: req.body.account_email
    })
  }
  next()
}

  
// Middleware para autorizar solo a usuarios con account_type "Employee" o "Admin"
validate.authorizeAdminEmployee = async (req, res, next) => {
  const token = req.cookies.jwt; // Se asume que el token está en la cookie "jwt"
  
  if (!token) {
    req.flash("error", "You must be logged in to access this page.");
    return res.redirect("/account/login");
  }
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      req.flash("error", "Invalid or expired token. Please log in again.");
      return res.redirect("/account/login");
    }
    
    // Usamos el campo account_type (tal como lo guarda la base de datos)
    if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
      return next();
    } else {
      req.flash("error", "You do not have permission to access this page.");
      return res.redirect("/account/login");
    }
  });
}

// Reglas para actualizar la cuenta (nombre, apellido, email)
validate.updateAccountRules = () => [
  body("account_firstname").trim().notEmpty().withMessage("First name is required."),
  body("account_lastname").trim().notEmpty().withMessage("Last name is required."),
  body("account_email").isEmail().withMessage("A valid email is required.").normalizeEmail()
];

validate.checkUpdateAccountData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await require("../utilities/").getNav(req, res);
    return res.status(400).render("account/account-update", {
      title: "Update Account Information",
      nav,
      account: req.body,
      errors: errors.array()
    });
  }
  next();
};

// Reglas para cambiar la contraseña
validate.changePasswordRules = () => [
  body("new_password")
    .isLength({ min: 12 })
    .withMessage("Password must be at least 12 characters.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/\d/)
    .withMessage("Password must contain at least one number.")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one symbol.")
];

validate.checkChangePasswordData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await require("../utilities/").getNav(req, res);
    return res.status(400).render("account/account-update", {
      title: "Update Account Information",
      nav,
      account: req.body,
      errors: errors.array()
    });
  }
  next();
};

  module.exports = validate