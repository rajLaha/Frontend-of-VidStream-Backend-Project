import { URL } from '../export/export.variable.js';

const playlistForm = document.querySelector('#playlistForm');
const loader = document.getElementById('loader');

// Handle Video uplaod form
const createPlaylistHandler = async (e) => {
  e.preventDefault();

  // Show the loader
  loader.classList.remove('hidden');

  //   get all the data from frontend
  const formData = new FormData(e.target);
  const dataBody = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`${URL}/api/v1/playlists/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataBody),
    });

    const responseMsg = await response.json();

    if (!response.ok) {
      alert(responseMsg || 'Playlist Creation failed! Please try again.');
      location.reload();
    } else {
      alert(responseMsg.message || 'Playlist Created Succesfully!');
      location.href = `./homepageVid.html`;
    }
  } catch (error) {
    alert(error || 'Playlist Creation failed! Please try again.');
    location.reload();
  } finally {
    // Hide the loader after data is fetched or error occurs
    loader.classList.add('hidden');
  }
};

playlistForm.addEventListener('submit', createPlaylistHandler);
