const express = require('express');
const router = express.Router();

// Ruta para generar el error 500 intencionalmente
router.get('/trigger-error', (req, res, next) => {
  // Lanzar un error 500 intencional
  const error = new Error('Intentional Server Error!');
  error.status = 500; // Establecemos el código de error 500
  next(error); // Pasamos el error al middleware de manejo de errores
});

module.exports = router;
