import { URL } from '../export/export.variable.js';

let currentPage = 1; // Track the current page
let totalPages = null; // Total pages, initially unknown
let isLoading = false; // Prevent multiple fetch calls simultaneously

// Load initial videos
loadVideos(currentPage);

// Function to load videos
async function loadVideos(page) {
  if (isLoading) return; // Prevent concurrent calls
  isLoading = true;

  const loader = document.getElementById('loadingSpinner');
  loader.classList.remove('hidden'); // Show loading indicator

  try {
    // Simulate a delay of 1500ms
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const response = await fetch(`${URL}/api/v1/videos/?page=${page}&limit=9`, {
      method: 'get',
      credentials: 'include',
    });
    const result = await response.json();

    if (result.success) {
      const videos = result.data.docs;
      totalPages = result.data.totalPages; // Update total pages
      renderVideos(videos);
    }
  } catch (error) {
    console.error('Error fetching videos:', error);
  } finally {
    isLoading = false;
    loader.classList.add('hidden'); // Hide loading indicator
  }
}

// Render videos in the grid
function renderVideos(videos) {
  const videoGrid = document.getElementById('videoGrid');

  videos.forEach((video) => {
    const { thumbnail, title, views, createdAt, ownerDetails, duration, _id } =
      video;

    const { fullName, avatar } = ownerDetails[0];
    const timeAgo = calculateTimeAgo(new Date(createdAt));
    const formattedDuration = formatDuration(duration);

    const videoBox = document.createElement('div');
    videoBox.className =
      'bg-gray-800 pt-[10px] rounded-lg overflow-hidden shadow-md relative group cursor-pointer video-box transition-transform transform hover:scale-105';
    videoBox.innerHTML = `
      <!-- Thumbnail -->
      <div class="relative"  >
        <img src="${thumbnail}" alt="${title}" class="w-full h-48 object-cover videoImages" id="${_id}">
        <span class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
          ${formattedDuration}
        </span>
      </div>
      <!-- Video Info -->
      <div class="p-4 bg-gray-700">
        <h3 class="text-lg font-semibold text-gray-100 truncate">${title}</h3>
        <div class="flex items-center mt-2">
          <img src="${avatar}" alt="${fullName}" class="w-8 h-8 rounded-full">
          <div class="ml-3">
            <p class="text-sm text-gray-100">${fullName}</p>
            <p class="text-xs text-gray-300">${views} views • ${timeAgo}</p>
          </div>
        </div>
      </div>
    `;
    videoGrid.appendChild(videoBox);
  });

  // handle the video player
  document.querySelectorAll('.videoImages').forEach((videoImage) => {
    videoImage.addEventListener('click', (event) => {
      // Update the URL with the userId parameter without refreshing the page
      window.location.href = `./videoPlayer.html?query=${encodeURIComponent(
        event.target.id
      )}`;
    });
  });
}

// Format video duration (e.g., 125.23 seconds -> 02:05)
function formatDuration(duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0'
  )}`;
}

// Calculate "time ago"
function calculateTimeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}

// Infinite Scroll Logic
window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (
    scrollTop + clientHeight >= scrollHeight - 10 &&
    !isLoading &&
    (totalPages === null || currentPage < totalPages)
  ) {
    currentPage++;
    loadVideos(currentPage);
  }
});
