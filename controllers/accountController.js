const utilities = require("../utilities/")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLoginView(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
    })
  }
  
  module.exports = { buildLoginView }