const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

module.exports = {getClassifications}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error);
  }
}

/* ***************************
 *  Get vehicle details by inventoryId
 * ************************** */
async function getVehicleById(inventoryId) {
  try {
    const res = await pool.query('SELECT * FROM public.inventory WHERE inventory_id = $1', [inventoryId]);

    if (res.rows.length === 0) {
      return null;
    }

    return res.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById};
