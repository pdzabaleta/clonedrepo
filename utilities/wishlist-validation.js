// utilities/wishlist-validation.js
const { body, validationResult } = require("express-validator");

const wishlistValidation = {};

// Reglas de validación para agregar un ítem a la wishlist
wishlistValidation.wishlistRules = () => {
  return [
    body("inventory_id")
      .notEmpty().withMessage("Inventory id is required.")
      .isNumeric().withMessage("Inventory id must be a number."),
    body("note")
      .optional({ checkFalsy: true })
      .isLength({ max: 100 }).withMessage("The note must be 100 characters or less.")
  ];
};

// Middleware para chequear errores de validación y retornar flash messages si hay errores
wishlistValidation.checkWishlistData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await require("./index").getNav(req, res);
    req.flash("error", errors.array().map(e => e.msg).join("<br>"));
    return res.redirect("back");
  }
  next();
};

module.exports = wishlistValidation;
