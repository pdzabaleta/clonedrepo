const invModel = require('../models/inventory-model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Util = {};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li>';
      grid +=
        '<a href="../../inv/vehicle/' +
        vehicle.inventory_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += '<h2>';
      grid +=
        '<a href="../../inv/vehicle/' +
        vehicle.inventory_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        '</a>';
      grid += '</h2>';
      grid +=
        '<span>$' +
        new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
        '</span>';
      grid += '</div>';
      grid += '<hr />';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res) {
  // Obtiene las clasificaciones (esto lo hace siempre, pero podrías hacerlo solo si es necesario)
  let data = await invModel.getClassifications();
  let list = '<ul>';

  // Siempre se muestra el link de Home
  list += '<li><a href="/" title="Home page">Home</a></li>';

  // Si el usuario está logueado y tiene permisos (account_type "Employee" o "Admin"), muestra el enlace Classification
  if (
    res.locals.loggedIn &&
    res.locals.user &&
    (res.locals.user.account_type === 'Employee' ||
      res.locals.user.account_type === 'Admin')
  ) {
    list +=
      '<li><a href="/inv/" title="Classification page">Classification</a></li>';
  }
  // Agrega los links de cada clasificación
  data.rows.forEach((row) => {
    list += '<li>';
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      '</a>';
    list += '</li>';
  });

  list += '</ul>';
  return list;
};

/* ************************
 * Build the vehicle details HTML
 ************************** */
Util.buildVehicleDetails = function (vehicle) {
  let details = `
    <div class="vehicle-details">
      <h1 class="vehicle-title">${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})</h1>
      <div class="vehicle-image-container">
        <img class="vehicle-image" src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
      </div>
      <div class="vehicle-info">
        <h2 class="vehicle-info-title">Details:</h2>
        <p class="vehicle-price"><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>
        <p class="vehicle-mileage"><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_mileage)} miles</p>
        <p class="vehicle-description"><strong>Description:</strong> ${vehicle.inv_description}</p>
      </div>
    </div>
  `;
  return details;
};

/* **************************************
 * Build the classification <select> list
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  try {
    let data = await invModel.getClassifications();
    let classificationList =
      '<select name="classification_id" id="classification_id" required>';
    classificationList += '<option value="">Choose a Classification</option>';
    data.rows.forEach((row) => {
      classificationList += `<option value="${row.classification_id}"`;
      if (classification_id && row.classification_id == classification_id) {
        classificationList += ' selected';
      }
      classificationList += `>${row.classification_name}</option>`;
    });
    classificationList += '</select>';
    return classificationList;
  } catch (error) {
    console.error('Error building classification list:', error);
    return `<select name="classification_id" id="classificationList" required>
              <option value="">No classifications found</option>
            </select>`;
  }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other functions in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash('Please log in');
          res.clearCookie('jwt');
          return res.redirect('/account/login');
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      },
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash('error', 'Please log in.');
    return res.redirect('/account/login');
  }
};

module.exports = Util;
