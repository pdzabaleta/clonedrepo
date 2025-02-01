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

  module.exports = {registerAccount, checkExistingEmail};