const utilities = require("../utilities/")
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLoginView(req, res, next) {
    let nav = await utilities.getNav(req, res)
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
  let nav = await utilities.getNav(req, res)
  const { account_email, account_password } = req.body

  const loginResult = await accountModel.checkLogin(account_email, account_password)

  if (loginResult) {
    req.flash("success", "Login successful!")
    res.redirect("/login") // O a donde corresponda
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
  let nav = await utilities.getNav(req, res)
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
  let nav = await utilities.getNav(req, res)
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
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


// W04 EMPIEZA AQUI////////////////////////////////////////////////////////////////////////////////////////////
/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav(req, res)
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.password)) {
      delete accountData.password
      accountData.accountType = accountData.account_type; 
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function accountManagementView(req, res) {
  let nav = await utilities.getNav(req, res);
  res.render("account/account", {
      title: "Account Management",
      nav,
      errors: null,
      flash: req.flash()
  });
}
  module.exports = { buildLoginView, buildRegisterView, registerAccount, processLogin, accountLogin, accountManagementView }