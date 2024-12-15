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

// fetch current UserData

const fetchUserData = async () => {
  const response = await fetch(
    `${URL}/api/v1/users/channel/${params.username}`,
    {
      method: 'get',
      credentials: 'include',
    }
  );

  const data = await response.json();

  return data;
};

// Helper Functions
function calculateTimeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

function formatDuration(duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Render Video Boxes
function renderVideos(videos) {
  const container = document.getElementById('videoGrid');

  videos.forEach(async (video) => {
    const timeAgo = calculateTimeAgo(video.createdAt);
    const formattedDuration = formatDuration(video.duration);
    const currentUserData = await fetchUserData();

    const videoBox = document.createElement('div');
    videoBox.className =
      'bg-gray-800 pt-[10px] rounded-lg overflow-hidden shadow-md relative group cursor-pointer transition-transform transform hover:scale-105';
    videoBox.innerHTML = `
      <!-- Thumbnail -->
      <div class="relative">
        <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-48 object-cover videoImages" id="${video._id}">
        <span class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
          ${formattedDuration}
        </span>
      </div>
      <!-- Video Info -->
      <div class="p-4 bg-gray-700">
        <h3 class="text-lg font-semibold text-gray-100 truncate">${video.title}</h3>
        <div class="flex items-center mt-2">
          <img src="${currentUserData.data.avatar}" alt="Owner Avatar" class="w-8 h-8 rounded-full">
          <div class="ml-3">
            <p class="text-sm text-gray-100">${currentUserData.data.fullName}</p>
            <p class="text-xs text-gray-300">${video.views} views • ${timeAgo}</p>
          </div>
        </div>
      </div>
    `;

    container.appendChild(videoBox);

    // handle the video player handle
    document.querySelectorAll('.videoImages').forEach((videImage) => {
      videImage.addEventListener('click', (event) => {
        // Update the URL with the userId parameter without refreshing the page
        window.location.href = `/form/videoPlayer.html?query=${encodeURIComponent(
          event.target.id
        )}`;
      });
    });
  });
}

// Load Data in Chunks (9 videos at a time)
let startIndex = 0;
const CHUNK_SIZE = 9;

function loadVideos(data) {
  const chunk = data.slice(startIndex, startIndex + CHUNK_SIZE);
  if (chunk.length > 0) {
    renderVideos(chunk);
    startIndex += CHUNK_SIZE;
  }
}

// Fetch Data and Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Simulated API response
  const videoResponse = await fetch(
    `${URL}/api/v1/dashboard/stats/${params.query}`,
    {
      method: 'get',
      credentials: 'include',
    }
  );

  const apiResponse = await videoResponse.json();

  const videos = apiResponse.data.getTotalVideos;

  // Initial render
  if (videos.length > 0) {
    loadVideos(videos);
  } else {
    const videoHeader = document.querySelector('#videoHeading');
    videoHeader.textContent = 'No Video Found';
    videoHeader.style.fontSize = '40px';
    videoHeader.style.display = 'flex';
    videoHeader.style.alignItems = 'center';
    videoHeader.style.justifyContent = 'center';
  }

  // Infinite Scroll
  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      loadVideos(videos);
    }
  });
});
