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

  module.exports = {registerAccount};