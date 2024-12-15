import { URL } from '../export/export.variable.js';

const changePassForm = document.querySelector('#changePassForm');
const loader = document.querySelector('#loader');
// Handle Login Data
const userLoginApi = async (e) => {
  e.preventDefault();

  // visible the loader
  loader.classList.remove('hidden');

  // Get form elements
  const formData = new FormData(e.target); // Automatically captures all fields
  const dataBody = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`${URL}/api/v1/users/change-password`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataBody),
    });

    if (response.status == 200) {
      (() => {
        setTimeout(() => {
          alert(`Password Changed Succesfully`);
          location.href = './homepageVid.html';
        }, 2000);
      })();
    } else {
      const errorData = await response.json();
      alert(errorData);
      location.reload();
    }
  } catch (error) {
    alert(`Changing Password Un-Successful | Error: ${error}`);
    location.reload();
  } finally {
    // visible the loader
    loader.classList.remove('hidden');
  }
};

// add Login method on submit form
changePassForm.addEventListener('submit', userLoginApi);
