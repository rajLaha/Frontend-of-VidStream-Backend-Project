import { URL } from '../export/export.variable.js';

const form = document.querySelector('#form');
const loader = document.getElementById('loader');

// Handle From Registration Data
const formSubmitHandler = async (e) => {
  e.preventDefault();

  // Show the loader
  loader.classList.remove('hidden');

  // Get form elements
  const formData = new FormData(e.target); // Automatically captures all fields

  // Send the form data using fetch
  try {
    const response = await fetch(`${URL}/api/v1/users/register`, {
      method: 'POST',
      body: formData, // Send the form data
    });

    const responseMsg = await response.json();

    if (!response.ok) {
      alert(responseMsg || 'Registration failed. Please try again.');
      location.reload();
    } else {
      alert(responseMsg.message || 'Registration Succesfully.');
      location.reload();
    }
  } catch (error) {
    alert(error || 'Registration failed. Please try again.');
    location.reload();
  } finally {
    // Hide the loader after data is fetched or error occurs
    loader.classList.add('hidden');
  }
};

// add Register method on submit form
form.addEventListener('submit', formSubmitHandler);
