const wishlistModel = require('../models/wishlist-model');
const utilities = require('../utilities/');

async function addWishlistItem(req, res, next) {
  try {
    const account_id = res.locals.user ? res.locals.user.account_id : null;
    const { inventory_id, note } = req.body;
    if (!account_id || !inventory_id) {
      req.flash('error', 'Invalid request data.');
      return res.redirect(req.get('Referrer') || '/');
    }
    if (isNaN(Number(inventory_id))) {
      req.flash('error', 'Invalid inventory id.');
      return res.redirect(req.get('Referrer') || '/');
    }
    // Verifica si el ítem ya existe en la wishlist
    const existingItem = await wishlistModel.getWishlistItem(
      account_id,
      inventory_id,
    );
    if (existingItem) {
      req.flash('error', 'Item is already in your wishlist.');
      return res.redirect(req.get('Referrer') || '/');
    }
    // Agrega el ítem a la wishlist, incluyendo la nota
    await wishlistModel.addToWishlist(account_id, inventory_id, note);
    req.flash('success', 'Item added to your wishlist successfully.');
    return res.redirect(req.get('Referrer') || '/');
  } catch (error) {
    next(error);
  }
}

async function removeWishlistItem(req, res, next) {
  try {
    const account_id = res.locals.user ? res.locals.user.account_id : null;
    const { inventory_id } = req.body;
    if (!account_id || !inventory_id) {
      req.flash('error', 'Invalid request data.');
      return res.redirect(req.get('Referrer') || '/');
    }
    await wishlistModel.removeFromWishlist(account_id, inventory_id);
    req.flash('success', 'Item removed from your wishlist.');
    return res.redirect(req.get('Referrer') || '/');
  } catch (error) {
    next(error);
  }
}

async function displayWishlist(req, res, next) {
  try {
    const account_id = res.locals.user ? res.locals.user.account_id : null;
    if (!account_id) {
      req.flash('error', 'Please log in to view your wishlist.');
      return res.redirect('/account/login');
    }
    const wishlistItems = await wishlistModel.getWishlist(account_id);
    let nav = await utilities.getNav(req, res);
    res.render('wishlist/wishlist', {
      title: 'My Wishlist',
      nav,
      wishlist: wishlistItems,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { addWishlistItem, removeWishlistItem, displayWishlist };
