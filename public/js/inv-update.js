// Select the form and the update button
const form = document.querySelector('#updateForm');
const updateBtn = document.querySelector('button');

// Select all fields that are not of type hidden
const fields = form.querySelectorAll(
  "input:not([type='hidden']), textarea, select",
);

// Store the initial values in an object, using the "name" attribute as the key
const initialValues = {};
fields.forEach((field) => {
  initialValues[field.name] = field.value.trim();
});

// Function that compares the current values with the original ones
function checkForm() {
  let isChanged = false;

  fields.forEach((field) => {
    // If the current value is different from the initial value, consider it a change
    if (field.value.trim() !== initialValues[field.name]) {
      isChanged = true;
    }
  });

  if (isChanged) {
    // If there was any change, enable the button
    updateBtn.removeAttribute('disabled');
  } else {
    // If there were no changes, disable the button
    updateBtn.setAttribute('disabled', 'disabled');
  }
}

// Listen for the "input" event on the form to check each time a field is modified
form.addEventListener('input', checkForm);

// Run the function on page load to set the initial state of the button
checkForm();
