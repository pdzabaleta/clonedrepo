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
    req.flash("error", "Please check your credentials and try again.")
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
  
  // Se asume que el middleware (en server.js) ya estableció res.locals.user con la info del usuario.
  const user = res.locals.user;
  
  // Verifica que user exista, de lo contrario redirige o muestra un error.
  if (!user) {
    req.flash("error", "User information not found. Please log in again.");
    return res.redirect("/account/login");
  }
  
  res.render("account/account", {
      title: "Account Management",
      nav,
      account_id: user.account_id,          // id de la cuenta
      account_firstname: user.first_name,   // primer nombre (según tu base de datos)
      account_type: user.account_type,        // tipo de cuenta ("Client", "Employee", "Admin")
      errors: null,
      flash: req.flash()
  });
}
/* ****************************************
 *  Deliver update account view
 * *************************************** */
async function buildUpdateAccountView(req, res, next) {
  let nav = await utilities.getNav(req, res);
  const account_id = req.params.account_id;
  const accountData = await accountModel.getAccountById(account_id);
  if (!accountData) {
    req.flash("error", "Account not found.");
    return res.redirect("/account/");
  }
  res.render("account/account-update", {
    title: "Update Account Information",
    nav,
    account: accountData,
    errors: null
  });
}

/* ****************************************
 *  Process account update request
 * *************************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav(req, res);
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  try {
    const result = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);
    if (result.rowCount > 0) {
      // Obtén la información actualizada de la cuenta
      const updatedAccount = await accountModel.getAccountById(account_id);
      delete updatedAccount.password;  // Quita la contraseña para el token

      // Genera un nuevo token JWT con la información actualizada
      const newToken = jwt.sign(updatedAccount, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
      
      // Actualiza la cookie con el nuevo token
      res.cookie("jwt", newToken, { httpOnly: true, maxAge: 3600 * 1000 });
      
      req.flash("success", "Account updated successfully.");
      return res.redirect("/account/");
    } else {
      req.flash("error", "Account update failed.");
      return res.render("account/account-update", {
        title: "Update Account Information",
        nav,
        account: req.body,
        errors: [{ msg: "Account update failed." }]
      });
    }
  } catch (error) {
    next(error);
  }
}

async function changePassword(req, res, next) {
  let nav = await utilities.getNav(req, res);
  const { account_id, new_password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(new_password, 10);
    const result = await accountModel.updatePassword(account_id, hashedPassword);
    if (result.rowCount > 0) {
      req.flash("success", "Password updated successfully.");
      return res.redirect("/account/");
    } else {
      req.flash("error", "Password update failed.");
      return res.render("account/account-update", {
        title: "Update Account Information",
        nav,
        account: req.body,
        errors: [{ msg: "Password update failed." }]
      });
    }
  } catch (error) {
    next(error);
  }
}

  module.exports = { buildLoginView, buildRegisterView, registerAccount, processLogin, accountLogin, accountManagementView, buildUpdateAccountView, updateAccount, changePassword }