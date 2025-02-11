const pool = require("../database/");


/* *****************************
*   Register new account
* *************************** */
async function registerAccount(first_name, last_name, email, password){
    try {
      const sql = "INSERT INTO account (first_name, last_name, email, password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [first_name, last_name, email, password])
    } catch (error) {
      return error.message
    }
  }  

  /* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, first_name, last_name, email, account_type, password FROM account WHERE email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

// Obtener cuenta por id
async function getAccountById(account_id) {
  try {
    const sql = 'SELECT * FROM account WHERE account_id = $1';
    const result = await pool.query(sql, [account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("getAccountById error: " + error);
    throw error;
  }
}

/* *****************************
 *  Update account information (first name, last name, email)
 ***************************** */
async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = `
      UPDATE account
      SET first_name = $1,
          last_name = $2,
          email = $3
      WHERE account_id = $4
      RETURNING *;
    `;
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
    return result;
  } catch (error) {
    console.error("updateAccount error: " + error);
    throw error;
  }
}

/* *****************************
 *  Update account password
 ***************************** */
async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = `
      UPDATE account
      SET password = $1
      WHERE account_id = $2
      RETURNING *;
    `;
    const result = await pool.query(sql, [hashedPassword, account_id]);
    return result;
  } catch (error) {
    console.error("updatePassword error: " + error);
    throw error;
  }
}
  module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, updatePassword};