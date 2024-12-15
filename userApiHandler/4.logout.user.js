import { URL } from '../export/export.variable.js';

const logoutBtn = document.querySelector('#logout');

const logoutHandler = async () => {
  try {
    const response = await fetch(`${URL}/api/v1/users/logout`, {
      method: 'POST',
      credentials: 'include', // This ensures cookies are sent with the request
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status == 200) {
      (() => {
        setTimeout(() => {
          location.href = '/form/index.html';
        }, 2000);
      })();
    } else {
      const errorData = await response.json();
      alert(errorData);
      location.reload();
    }
  } catch (error) {
    alert(`Logout Un-Successful | Error: ${error}`);
    location.reload();
  }
};

logoutBtn.addEventListener('click', logoutHandler);
