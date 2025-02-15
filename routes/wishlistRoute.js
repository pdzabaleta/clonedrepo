// routes/wishlistRoute.js
const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const utilities = require("../utilities/");
const wishlistValidation = require("../utilities/wishlist-validation");

// Rutas de wishlist
router.post(
  "/add",
  utilities.checkLogin, // Asegúrate de que el usuario esté logueado (definido en utilities)
  wishlistValidation.wishlistRules(),
  wishlistValidation.checkWishlistData,
  utilities.handleErrors(wishlistController.addWishlistItem)
);

router.post(
  "/remove",
  utilities.checkLogin,
  utilities.handleErrors(wishlistController.removeWishlistItem)
);

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(wishlistController.displayWishlist)
);

module.exports = router;
