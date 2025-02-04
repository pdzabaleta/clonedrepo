const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * *************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************************
 * Add a new classification
 ***************************************/
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
 ***************************************/
async function checkExistingClassification(classification_name) {
  try {
    const result = await pool.query(
      "SELECT * FROM public.classification WHERE classification_name = $1",
      [classification_name]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error checking if classification exists:", error);
    throw error;
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * *************************** */
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
    console.error("getInventoryByClassificationId error: " + error);
  }
}

/* ***************************
 *  Get vehicle details by inventoryId
 * *************************** */
async function getVehicleById(inventoryId) {
  try {
    const res = await pool.query(
      'SELECT * FROM public.inventory WHERE inventory_id = $1',
      [inventoryId]
    );
    if (res.rows.length === 0) {
      return null;
    }
    return res.rows[0];
  } catch (error) {
    throw error;
  }
}


/* ***************************************
 * Add a new vehicle to the inventory table
 ***************************************/
async function addVehicle(vehicle) {
  try {
    const sql = `
      INSERT INTO public.inventory 
        (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, classification_id, inv_year, inv_price, inv_mileage)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING inventory_id;
    `;
    const params = [
      vehicle.inv_make,
      vehicle.inv_model,
      vehicle.inv_description,
      vehicle.inv_image,
      vehicle.inv_thumbnail,
      vehicle.classification_id,
      vehicle.inv_year,
      vehicle.inv_price,
      vehicle.inv_mileage
    ];
    const result = await pool.query(sql, params);
    return result.rows[0].inventory_id; // Retorna el ID insertado
  } catch (error) {
    console.error("Error adding vehicle:", error);
    throw error;
  }
}

module.exports = {
  getClassifications,
  addClassification,
  checkExistingClassification,
  getInventoryByClassificationId,
  getVehicleById,
  addVehicle
};
