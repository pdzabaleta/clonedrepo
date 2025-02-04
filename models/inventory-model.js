const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************************
 * Add a new classification
 ************************************** */
async function addClassification(classification_name) {
  try {
    await pool.query(
      "INSERT INTO public.classification (classification_name) VALUES ($1)",
      [classification_name]
    );
  } catch (error) {
    console.error("Error adding classification:", error);
    throw error;
  }
}

/* ***************************************
 * Check if a classification already exists
 ************************************** */
async function checkExistingClassification(classification_name) {
  try {
    const result = await pool.query(
      "SELECT * FROM public.classification WHERE classification_name = $1",
      [classification_name]
    );
    return result.rows.length > 0; // If any row is returned, the classification exists
  } catch (error) {
    console.error("Error checking if classification exists:", error);
    throw error;
  }
}

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

module.exports = { getClassifications, addClassification, checkExistingClassification, getInventoryByClassificationId, getVehicleById };
