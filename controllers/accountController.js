const utilities = require("../utilities/")
const accountModel = require("../models/account-model");

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLoginView(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null, // Se añade la variable errors
    })
  }
  /* ****************************************
*  Process Login
* *************************************** */
async function processLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const loginResult = await accountModel.checkLogin(account_email, account_password)

  if (loginResult) {
    req.flash("success", "Login successful!")
    res.redirect("/dashboard") // O a donde corresponda
  } else {
    req.flash("error", "Invalid email or password.")
    res.status(401).render("account/login", {
      title: "Login",
      nav,
      errors: [{ msg: "Invalid email or password." }], // Aquí se pasan los errores
    })
  }
}

  /* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegisterView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "success",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("error", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

  module.exports = { buildLoginView, buildRegisterView, registerAccount, processLogin }