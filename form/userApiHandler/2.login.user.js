import { URL } from '../export/export.variable.js';

const loginForm = document.querySelector('#loginForm');

// Handle Login Data
const userLoginApi = async (e) => {
  e.preventDefault();

  // Show the loader
  loader.classList.remove('hidden');

  // Get form elements
  const formData = new FormData(e.target); // Automatically captures all fields

  let formDataObj = {};

  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });

  try {
    const response = await fetch(`${URL}/api/v1/users/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataObj),
    });

    if (response.status == 200) {
      location.href = '/form/homepageVid.html';
    } else {
      const errorData = await response.json();
      alert(errorData);
      location.reload();
    }
  } catch (error) {
    alert(`Login Un-Successful | Error: ${error}`);
    location.reload();
  } finally {
    // Hide the loader after data is fetched or error occurs
    loader.classList.add('hidden');
  }
};

// add Login method on submit form
loginForm.addEventListener('submit', userLoginApi);
