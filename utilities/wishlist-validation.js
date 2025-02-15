// utilities/wishlist-validation.js
const { body, validationResult } = require("express-validator");

const wishlistValidation = {};

// Reglas de validación para agregar un ítem a la wishlist
wishlistValidation.wishlistRules = () => {
  return [
    body("inventory_id")
      .notEmpty().withMessage("Inventory id is required.")
      .isNumeric().withMessage("Inventory id must be a number.")
  ];
};

// Middleware para chequear los errores de validación y retornar flash messages si hay errores
wishlistValidation.checkWishlistData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Asumimos que utilities.getNav está exportado de utilities/index.js
    let nav = await require("./index").getNav(req, res);
    // Puedes concatenar los mensajes de error en un solo string
    req.flash("error", errors.array().map(e => e.msg).join("<br>"));
    return res.redirect("back");
  }
  next();
};

module.exports = wishlistValidation;
