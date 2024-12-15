import { URL } from '../export/export.variable.js';
import { removeVideoFromPlaylist } from './4.removeVideosFromPlaylist.playlist.js';

// Get the value from the query parameters
const urlParams = new URLSearchParams(window.location.search);
const playlistId = urlParams.get('query');

const fetchPlaylist = async () => {
  const response = await fetch(`${URL}/api/v1/playlists/${playlistId}`, {
    method: 'get',
    credentials: 'include',
  });
  const data = await response.json();
  return data;
};

// Mocked API response
const apiResponse = await fetchPlaylist();

// Helper: Convert ISO date to "time ago"
function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.floor((now - date) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(secondsAgo / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

// Populate Playlist Data
const playlistData = apiResponse.data[0];
document.getElementById('playlistTitle').textContent = playlistData.name;
document.getElementById('playlistDescription').textContent =
  playlistData.description;

const videoGrid = document.getElementById('videoGrid');
playlistData.videoDetails.forEach((video) => {
  // Video Card
  const videoCard = document.createElement('div');
  videoCard.className =
    'relative bg-gray-700 rounded-lg shadow-md overflow-hidden';

  // Thumbnail
  const thumbnail = document.createElement('img');
  thumbnail.src = video.thumbnail;
  thumbnail.alt = video.title;
  thumbnail.className = 'w-full h-32 sm:h-40 object-cover';

  // Three-dot Button (Top-right)
  const menuContainer = document.createElement('div');
  menuContainer.className = 'absolute top-2 right-2 z-50';

  const menuButton = document.createElement('button');
  menuButton.className = 'text-gray-400 hover:text-gray-200 focus:outline-none';
  menuButton.innerHTML = `<i class="fas fa-ellipsis-v"></i>`;
  menuButton.onclick = () => {
    dropdownMenu.classList.toggle('hidden');
  };

  // Dropdown Menu
  const dropdownMenu = document.createElement('div');
  dropdownMenu.className =
    'absolute right-0 bg-gray-800 text-gray-200 rounded shadow-lg p-2 hidden z-50';
  dropdownMenu.style.marginTop = '10px'; // Ensure dropdown stays outside the button
  dropdownMenu.innerHTML = `<button class="block px-4 py-2 text-sm hover:bg-gray-600 rounded removeBtns" id="${video._id}">Remove</button>`;

  menuContainer.appendChild(menuButton);
  menuContainer.appendChild(dropdownMenu);

  // Video Info
  const videoInfo = document.createElement('div');
  videoInfo.className = 'p-4';

  const videoTitle = document.createElement('h3');
  videoTitle.className = 'text-gray-200 font-semibold text-lg truncate';
  videoTitle.textContent = video.title;

  const videoMeta = document.createElement('p');
  videoMeta.className = 'text-gray-500 text-sm mt-1';
  videoMeta.textContent = `${timeAgo(video.createdAt)} • ${video.views} views`;

  // Append Elements
  videoInfo.appendChild(videoTitle);
  videoInfo.appendChild(videoMeta);
  videoCard.appendChild(thumbnail);
  videoCard.appendChild(menuContainer);
  videoCard.appendChild(videoInfo);

  // Add to Grid
  videoGrid.appendChild(videoCard);
});

const removeBtns = document.querySelectorAll('.removeBtns');

if (removeBtns) {
  removeBtns.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const videoId = e.target.id;
      const remove = await removeVideoFromPlaylist(videoId, playlistId);
      if (remove.ok) {
        alert('Video Removed from Playlist Succesfully');
        location.reload();
      } else {
        alert(remove.message);
      }
    });
  });
}

const deletePlaylist = async () => {
  try {
    const response = await fetch(`${URL}/api/v1/playlists/${playlistId}`, {
      method: 'delete',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      alert('Playlist Delete Succesfully');
      location.href = `./homepageVid.html`;
    } else {
      alert(response.message);
      location.reload();
    }
  } catch (error) {
    alert(error);
    location.reload();
  }
};

const dltBtn = document.querySelector('#dltBtn');
dltBtn.addEventListener('click', deletePlaylist());
