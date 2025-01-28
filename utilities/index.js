const invModel = require("../models/inventory-model");
const Util = {};

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach(vehicle => {
      grid += '<li>';
      grid +=  '<a href="../../inv/vehicle/' + vehicle.inventory_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      + '" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      + ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += '<h2>';
      grid += '<a href="../../inv/vehicle/' + vehicle.inventory_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>';
      grid += '</h2>';
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
      grid += '</div>';
      grid += '<hr />';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* ************************
 * Build the vehicle details HTML
 ************************** */
Util.buildVehicleDetails = function(vehicle) {
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

module.exports = Util;
