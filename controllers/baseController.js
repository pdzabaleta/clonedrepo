const utilities = require('../utilities/');
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav(req, res);
  res.render('index', { title: 'Home', nav });
  // req.flash("notice", "This is a flash message.")
};

module.exports = baseController;
