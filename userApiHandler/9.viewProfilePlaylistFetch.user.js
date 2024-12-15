import { URL } from '../export/export.variable.js';
// Get the value from the query parameters
const urlParams = new URLSearchParams(
  window.location.href.split('?').slice(1).join('&')
);

// Step 3: Convert parameters into an object
const params = {};
urlParams.forEach((value, key) => {
  params[key] = value;
});

const userId = params.query;

document.addEventListener('DOMContentLoaded', async () => {
  // Simulated API Response
  const userPlaylistResponse = await fetch(
    `${URL}/api/v1/playlists/user/${userId}`,
    {
      method: 'get',
      credentials: 'include',
    }
  );

  if (userPlaylistResponse.ok) {
    const apiResponse = await userPlaylistResponse.json();

    // Render Playlist Boxes
    const playlistsContainer = document.getElementById('playlistGrid');

    apiResponse.data.forEach(async (playlist) => {
      // Fetch playlist by id and set thumbnail
      const fetchPlaylistByIdResponse = await fetch(
        `${URL}/api/v1/playlists/${playlist._id}`,
        {
          method: 'get',
          credentials: 'include',
        }
      );

      const playlistByIdData = await fetchPlaylistByIdResponse.json();

      const thumbnail =
        playlist.video.length > 0 &&
        playlistByIdData?.data[0]?.videoDetails.length > 0
          ? playlistByIdData?.data[0]?.videoDetails[0]?.thumbnail
          : 'https://via.placeholder.com/300x300.png?text=No+Videos';

      const playlistBox = document.createElement('div');
      playlistBox.className =
        'relative rounded-lg overflow-hidden shadow-lg group cursor-pointer bg-gray-800 transition-transform transform hover:scale-105';

      playlistBox.innerHTML = `
            <!-- Thumbnail -->
            <div class="relative w-full h-48">
              <img src="${thumbnail}" alt="${
        playlist.name
      }" class="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-300">
              <div class="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
            <!-- Playlist Info -->
            <div class="w-full p-4 bg-gray-700 flex items-center justify-between">
             <div>
                <h3 class="text-lg font-semibold text-white truncate">${
                  playlist.name
                }</h3>
                <p class="text-sm text-gray-300 mb-3 line-clamp-2">${
                  playlist.description
                }</p>
                <p class="text-xs text-gray-400">${playlist.video.length} ${
        playlist.video.length === 1 ? 'video' : 'videos'
      }</p>
              </div>
              <button class="mt-3 bg-blue-600 text-white text-sm py-1 px-4 rounded hover:bg-blue-500 focus:outline-none" id="${
                playlistByIdData.data[0]._id
              }">
                View Playlist
              </button>
            </div>
          `;

      // Add an event listener for the "View Playlist" button
      playlistBox.querySelector('button').addEventListener('click', (e) => {
        // Update the URL with the userName and userId parameter
        window.location.href = `/form/viewPlaylistPage.html?query=${encodeURIComponent(
          e.target.id
        )}`;
      });

      playlistsContainer.appendChild(playlistBox);
    });
  } else {
    const playlistHeading = document.querySelector('#playlistHeading');
    playlistHeading.innerText = 'No Playlist found!';
    playlistHeading.style.fontSize = '40px';
    playlistHeading.style.display = 'flex';
    playlistHeading.style.alignItems = 'center';
    playlistHeading.style.justifyContent = 'center';
  }
});
