import { URL } from '../export/export.variable.js';
// Get the value from the query parameters
const urlParams = new URLSearchParams(window.location.search);
export const videoId = urlParams.get('query');

// fetch current user Playlists
const fetchCurrentUserPlaylist = async () => {
  const currentUser = await fetch(`${URL}/api/v1/users/current-user`, {
    method: 'get',
    credentials: 'include',
  });

  const currUserData = await currentUser.json();

  const currUserId = await currUserData.data._id;

  const response = await fetch(`${URL}/api/v1/playlists/user/${currUserId}`, {
    method: 'get',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
};

// Button to trigger popup
const addPlaylistBtn = document.getElementById('addPlaylistBtn');
const loader = document.getElementById('loader');

addPlaylistBtn.addEventListener('click', async () => {
  // Show the loader
  loader.classList.remove('hidden');

  try {
    const apiResponse = await fetchCurrentUserPlaylist();

    // Create the popup overlay
    const overlay = document.createElement('div');
    overlay.className =
      'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center';

    // Create the popup container
    const popup = document.createElement('div');
    popup.className =
      'bg-gray-800 w-full max-w-lg rounded-lg shadow-lg p-6 space-y-4 relative';

    // Close button
    const closeButton = document.createElement('button');
    closeButton.className =
      'absolute top-3 right-3 text-gray-300 hover:text-gray-500';
    closeButton.textContent = '✕';
    closeButton.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    // Title
    const title = document.createElement('h2');
    title.className = 'text-xl font-bold text-gray-100';
    title.textContent = 'Your Playlists';

    // Add content based on API response
    const contentContainer = document.createElement('div');
    contentContainer.className = 'space-y-4';

    if (
      !apiResponse ||
      apiResponse.statusCode !== 200 ||
      apiResponse.data.length === 0
    ) {
      // No playlists or error scenario
      const noPlaylistMessage = document.createElement('p');
      noPlaylistMessage.className = 'text-gray-400 text-center';
      noPlaylistMessage.textContent = 'No playlists found.';

      const createPlaylistButton = document.createElement('button');
      createPlaylistButton.className =
        'w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg';
      createPlaylistButton.innerHTML =
        '<i class="fa-solid fa-plus mr-2"></i> Create Playlist';
      createPlaylistButton.addEventListener('click', () => {
        window.location.href = './uploadPlaylistPage.html'; // Redirect to create playlist page
      });

      contentContainer.appendChild(noPlaylistMessage);
      contentContainer.appendChild(createPlaylistButton);
    } else {
      // Display playlists
      apiResponse.data.forEach((playlist) => {
        const playlistItem = document.createElement('div');
        playlistItem.className =
          'flex items-center bg-gray-700 rounded-md p-4 shadow-md space-x-4';

        const thumbnail = document.createElement('div');
        thumbnail.className =
          'w-16 h-16 bg-gray-500 flex items-center justify-center text-gray-300 text-sm rounded-md';
        thumbnail.textContent = playlist.video.length
          ? `${playlist.video.length} Videos`
          : 'No Video';

        const playlistDetails = document.createElement('div');
        playlistDetails.className = 'flex-1';

        const playlistName = document.createElement('h3');
        playlistName.className = 'text-gray-200 font-semibold';
        playlistName.textContent = playlist.name;

        const playlistDescription = document.createElement('p');
        playlistDescription.className = 'text-gray-400 text-sm';
        playlistDescription.textContent = playlist.description;

        playlistDetails.appendChild(playlistName);
        playlistDetails.appendChild(playlistDescription);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = playlist._id; // Store playlist ID in the checkbox value
        checkbox.className = 'form-checkbox text-indigo-500';

        // Ensure only one checkbox is selected at a time
        checkbox.addEventListener('change', (e) => {
          const checkboxes = contentContainer.querySelectorAll(
            "input[type='checkbox']"
          );
          checkboxes.forEach((box) => {
            if (box !== e.target) {
              box.checked = false;
            }
          });
        });

        playlistItem.appendChild(thumbnail);
        playlistItem.appendChild(playlistDetails);
        playlistItem.appendChild(checkbox);

        contentContainer.appendChild(playlistItem);
      });
    }

    // Save and Cancel Buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex justify-end space-x-4';

    const saveButton = document.createElement('button');
    saveButton.className =
      'px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg';
    saveButton.textContent = 'Save';
    saveButton.id = 'saveBtn';

    // Save button handler
    saveButton.addEventListener('click', async () => {
      const checkboxes = contentContainer.querySelector(
        "input[type='checkbox']:checked"
      );

      if (checkboxes) {
        const playlistIds = checkboxes.value;

        const response = await fetch(
          `${URL}/api/v1/playlists/add/${videoId}/${playlistIds}`,
          {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          alert('Videos add to Playlist Succesfully!');
          document.body.removeChild(overlay);
        } else {
          alert(await response.json());
          document.body.removeChild(overlay);
        }
      } else {
        alert('Please select a Playlist!');
      }
    });

    const cancelButton = document.createElement('button');
    cancelButton.className =
      'px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(saveButton);

    // Append elements to the popup
    popup.appendChild(closeButton);
    popup.appendChild(title);
    popup.appendChild(contentContainer);
    popup.appendChild(buttonContainer);

    // Append popup to overlay
    overlay.appendChild(popup);

    // Append overlay to body
    document.body.appendChild(overlay);
  } catch (error) {
    alert(`Something went wrong! - ${error}`);
  } finally {
    // Hide the loader after data is fetched or error occurs
    loader.classList.add('hidden');
  }
});
