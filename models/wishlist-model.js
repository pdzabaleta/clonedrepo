const pool = require('../database/');

async function addToWishlist(account_id, inventory_id, note) {
  try {
    const sql =
      'INSERT INTO wishlist (account_id, inventory_id, note) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(sql, [account_id, inventory_id, note]);
    return result.rows[0];
  } catch (error) {
    console.error('addToWishlist error: ' + error);
    throw error;
  }
}

async function getWishlistItem(account_id, inventory_id) {
  try {
    const sql =
      'SELECT * FROM wishlist WHERE account_id = $1 AND inventory_id = $2';
    const result = await pool.query(sql, [account_id, inventory_id]);
    return result.rows[0];
  } catch (error) {
    console.error('getWishlistItem error: ' + error);
    throw error;
  }
}

async function getWishlist(account_id) {
  try {
    const sql = `
      SELECT i.*, w.note 
      FROM inventory i
      JOIN wishlist w ON i.inventory_id = w.inventory_id
      WHERE w.account_id = $1
      ORDER BY w.created_at DESC
    `;
    const result = await pool.query(sql, [account_id]);
    return result.rows;
  } catch (error) {
    console.error('getWishlist error: ' + error);
    throw error;
  }
}

async function removeFromWishlist(account_id, inventory_id) {
  try {
    const sql =
      'DELETE FROM wishlist WHERE account_id = $1 AND inventory_id = $2 RETURNING *';
    const result = await pool.query(sql, [account_id, inventory_id]);
    return result.rows[0];
  } catch (error) {
    console.error('removeFromWishlist error: ' + error);
    throw error;
  }
}

module.exports = {
  addToWishlist,
  getWishlistItem,
  getWishlist,
  removeFromWishlist,
};
