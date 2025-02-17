const express = require('express');
const router = express.Router();
const utilities = require('../utilities/'); // Ahora incluye authorizeAdminEmployee
const invController = require('../controllers/invController');
const validate = require('../utilities/classificationValidation'); // Validaciones para clasificación
const inventoryValidation = require('../utilities/inventoryValidation');
const regValidate = require('../utilities/account-validation');

// ===========================
// RUTAS PÚBLICAS (accesibles sin estar logueado)
// ===========================

// Construir inventario por clasificación
router.get(
  '/type/:classificationId',
  utilities.handleErrors(invController.buildByClassificationId),
);

// Obtener detalles de un vehículo
router.get(
  '/vehicle/:inventoryId',
  utilities.handleErrors(invController.getVehicleDetails),
);

// Obtener inventario en formato JSON (pública)
router.get(
  '/getInventory/:classification_id',
  utilities.handleErrors(invController.getInventoryJSON),
);

// ===========================
// RUTAS ADMINISTRATIVAS (protegidas)
// Estas rutas solo deben ser accesibles a usuarios con account_type "Employee" o "Admin"
// Se protege usando utilities.authorizeAdminEmployee
// ===========================

// Vista de gestión del inventario (no debe ser accesible públicamente)
router.get(
  '/',
  regValidate.authorizeAdminEmployee,
  utilities.handleErrors(invController.showManagementView),
);

// Agregar clasificación
router.get(
  '/add-classification',
  regValidate.authorizeAdminEmployee,
  utilities.handleErrors(invController.showAddClassificationForm),
);
router.post(
  '/add-classification',
  regValidate.authorizeAdminEmployee,
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification),
);

// Agregar inventario
router.get(
  '/add-inventory',
  regValidate.authorizeAdminEmployee,
  utilities.handleErrors(invController.showAddInventoryForm),
);
router.post(
  '/add-inventory',
  regValidate.authorizeAdminEmployee,
  inventoryValidation.inventoryRules(),
  inventoryValidation.checkInventoryData,
  utilities.handleErrors(invController.addInventory),
);

// Editar inventario
router.get(
  '/edit/:inventory_id',
  regValidate.authorizeAdminEmployee,
  utilities.handleErrors(invController.editInventoryView),
);
router.post(
  '/update',
  regValidate.authorizeAdminEmployee,
  inventoryValidation.inventoryRules(),
  inventoryValidation.checkUpdateData,
  utilities.handleErrors(invController.updateInventory),
);

// Eliminar inventario
router.get(
  '/delete/:inventory_id',
  regValidate.authorizeAdminEmployee,
  utilities.handleErrors(invController.deleteInventoryView),
);
router.post(
  '/delete',
  regValidate.authorizeAdminEmployee,
  inventoryValidation.deleteRules(),
  inventoryValidation.checkDeleteData,
  utilities.handleErrors(invController.deleteInventory),
);

module.exports = router;
