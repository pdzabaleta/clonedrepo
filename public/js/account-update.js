document.addEventListener('DOMContentLoaded', () => {
  // Formulario de actualización de cuenta
  console.log('account-update.js is loaded');

  const accountForm = document.getElementById('accountUpdateForm');
  const accountButton = document.getElementById('accountUpdateButton');

  if (accountForm && accountButton) {
    // Guarda los valores iniciales de los inputs (solo los de texto y email)
    const initialAccountValues = {};
    const accountInputs = accountForm.querySelectorAll(
      "input[type='text'], input[type='email']",
    );
    accountInputs.forEach((input) => {
      initialAccountValues[input.name] = input.value.trim();
    });

    // Función para verificar si alguno de los campos ha cambiado
    function checkAccountForm() {
      let changed = false;
      accountInputs.forEach((input) => {
        if (input.value.trim() !== initialAccountValues[input.name]) {
          changed = true;
        }
      });
      if (changed) {
        accountButton.removeAttribute('disabled');
      } else {
        accountButton.setAttribute('disabled', 'disabled');
      }
    }

    // Escucha el evento input para cada campo
    accountInputs.forEach((input) => {
      input.addEventListener('input', checkAccountForm);
    });

    // Ejecuta la verificación al cargar la página
    checkAccountForm();
  }

  // Formulario de cambio de contraseña
  const passwordForm = document.getElementById('passwordUpdateForm');
  const passwordButton = document.getElementById('passwordUpdateButton');

  if (passwordForm && passwordButton) {
    const newPasswordInput = passwordForm.querySelector(
      "input[name='new_password']",
    );

    function checkPasswordForm() {
      // Si hay algún valor en el campo, habilita el botón
      if (newPasswordInput.value.trim() !== '') {
        passwordButton.removeAttribute('disabled');
      } else {
        passwordButton.setAttribute('disabled', 'disabled');
      }
    }

    // Escucha el evento input en el campo de nueva contraseña
    newPasswordInput.addEventListener('input', checkPasswordForm);

    // Ejecuta la verificación al cargar la página
    checkPasswordForm();
  }
});
