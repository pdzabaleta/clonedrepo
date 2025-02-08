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

  module.exports = {registerAccount, checkExistingEmail, getAccountByEmail};