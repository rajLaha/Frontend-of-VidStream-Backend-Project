import { URL } from '../export/export.variable.js';

document.addEventListener('DOMContentLoaded', function () {
  // Check if we are on the input page
  if (window.location.pathname.includes('homepageVid.html')) {
    const searchBtn = document.querySelector('#searchbtn');
    const input = document.querySelector('#inputSearch');

    searchBtn.addEventListener('click', () => {
      const inputValue = input.value;

      // Option 1: Pass the value using query parameters in the URL
      if (inputValue) {
        (async () => {
          const response = await fetch(
            `${URL}/api/v1/users/channel/${inputValue}`,
            {
              method: 'get',
              credentials: 'include',
            }
          );

          const data = await response.json();

          if (response.ok) {
            // Update the URL with the userName and userId parameter
            window.location.href = `./viewProfile.html?username=${encodeURIComponent(
              data.data.userName
            )}?query=${encodeURIComponent(data.data._id)}`;
          }

          if (!response.ok) {
            alert('User not found');
            this.location.reload();
          }
        })();
      }
    });
  }
});
