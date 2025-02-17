// Needed Resources
const express = require('express');
const router = new express.Router();
const utilities = require('../utilities/');
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation');

router.get('/login', utilities.handleErrors(accountController.buildLoginView));

router.get(
  '/register',
  utilities.handleErrors(accountController.buildRegisterView),
);
// Process the registration data
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount),
);
// Process the login attempt
router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin),
);

// Account management view after login
router.get(
  '/',
  utilities.checkLogin,
  utilities.handleErrors(accountController.accountManagementView),
);

router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/account/login');
});

router.get(
  '/update/:account_id',
  utilities.handleErrors(accountController.buildUpdateAccountView),
);
router.post(
  '/update',
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount),
);
router.post(
  '/update-password',
  regValidate.changePasswordRules(),
  regValidate.checkChangePasswordData,
  utilities.handleErrors(accountController.changePassword),
);

module.exports = router;
