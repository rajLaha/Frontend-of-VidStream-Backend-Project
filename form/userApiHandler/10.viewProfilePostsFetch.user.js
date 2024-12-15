import { URL } from '../export/export.variable.js';
import { deletePostHandler } from '../postApiHandler/1.deletePost.posts.js';
import { showDialog } from '../postApiHandler/2.updatePost.post.js';
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
  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now - past) / 1000);

    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count > 0) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }
    return 'Just now';
  };

  // Simulated API Response
  const response = await fetch(`${URL}/api/v1/posts/user/${userId}`, {
    method: 'get',
    credentials: 'include',
  });

  // fetch current user
  const currResponse = await fetch(`${URL}/api/v1/users/current-user`, {
    method: 'get',
    credentials: 'include',
  });

  const currUserData = await currResponse.json();
  const loggedInUserId = currUserData.data._id;

  if (response.ok) {
    const data = await response.json();
    const postsData = await data.data;

    const communityPosts = document.getElementById('postContainer');

    postsData.forEach(async (post) => {
      const postBox = document.createElement('div');
      postBox.className =
        'relative w-full max-w-md bg-gray-700 rounded-lg shadow-lg overflow-hidden text-white lg:mx-4 transition-transform transform hover:scale-105';

      const { content, image, ownerDetails, createdAt } = post;
      const { fullName, avatar, _id } = ownerDetails[0];

      // Condition to show the three-dot menu (if the post owner matches the logged-in user)
      const showMenu = loggedInUserId === _id;

      postBox.innerHTML = `
      
            <!-- User Info -->
            <div class="flex items-center p-4">
              <img src="${avatar}" alt="${fullName}" class="w-12 h-12 rounded-full">
              <div class="ml-3">
                <p class="text-lg font-semibold text-gray-100">${fullName}</p>
                <p class="text-sm text-gray-500">${timeAgo(createdAt)}</p>
              </div>
            </div>

            <!-- Post Content -->
            <div class="p-4">
              ${
                image
                  ? `<img src="${image}" alt="Post Image" class="w-full h-64 object-cover rounded-md mb-3">`
                  : ''
              }
              <p class="text-md">${content}</p>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between px-4 py-3 border-t border-gray-700">

              <button class="flex items-center space-x-2 text-gray-300 hover:text-blue-400">
                <i class="fa-solid fa-thumbs-up text-blue-400"></i>
                <span>Like</span>
              </button>

              <button class="flex items-center space-x-2 text-gray-300 hover:text-blue-400">
                <i class="fa-solid fa-comments"></i>
                <span class="commentsBtn" id="${post._id}">Comments</span>
              </button>
              ${
                showMenu
                  ? `<div class="dropdown">
                        <button class="menu-button flex items-center justify-center w-8 h-8    bg-gray-700 rounded-full text-white hover:bg-gray-600" id="dropdownMenu">
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>

                        <div class="menu-options hidden absolute top-12 right-4 bg-gray-700 rounded-md shadow-lg">
                            <button class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 updatePost" id="${post._id}">Update</button>
                            <button class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 deletePost" id="${post._id}">Delete</button>
                        </div>
                    </div>`
                  : ''
              }
            </div>
          `;

      // Add hover logic for menu
      const menuButton = postBox.querySelector('.menu-button');
      const menuOptions = postBox.querySelector('.menu-options');

      if (menuButton) {
        menuButton.addEventListener('click', () => {
          menuOptions.classList.toggle('hidden');
        });
      }
      communityPosts.appendChild(postBox);
    });

    // Update button handler
    document.querySelectorAll('.updatePost').forEach((box) => {
      box.addEventListener('click', (e) => {
        showDialog(e.target.id);
      });
    });

    // Delete button handler
    document.querySelectorAll('.deletePost').forEach((box) => {
      box.addEventListener('click', async (e) => {
        await deletePostHandler(e.target.id);
      });
    });
  } else {
    const postsHeading = document.querySelector('#postsHeading');
    postsHeading.innerText = 'No Post found!';
    postsHeading.style.fontSize = '40px';
    postsHeading.style.display = 'flex';
    postsHeading.style.alignItems = 'center';
    postsHeading.style.justifyContent = 'center';
  }

  const showCommentsPopup = async (postId) => {
    let currentPage = 1;
    let isLoading = false;
    let hasNextPage = true; // Start with hasNextPage being true

    // Create Popup Container
    const popupOverlay = document.createElement('div');
    popupOverlay.classList =
      'fixed inset-0 bg-gray-900 bg-opacity-100 z-50 flex items-center justify-center';
    popupOverlay.id = 'popupOverlay';

    const popupContainer = document.createElement('div');
    popupContainer.classList =
      'w-10/12 md:w-1/2 lg:w-1/3 bg-gray-800 rounded-lg shadow-lg overflow-hidden';
    popupOverlay.appendChild(popupContainer);

    const popupHeader = document.createElement('div');
    popupHeader.classList = 'flex justify-between items-center p-4 bg-gray-700';
    popupHeader.innerHTML = `
      <h2 class="text-lg font-semibold">Comments</h2>
      <button id="closePopup" class="text-white text-xl font-bold">&times;</button>
    `;
    popupContainer.appendChild(popupHeader);

    const commentsContainer = document.createElement('div');
    commentsContainer.id = 'commentsContainer';
    commentsContainer.classList = 'max-h-96 overflow-y-scroll p-4';
    popupContainer.appendChild(commentsContainer);

    const commentInputContainer = document.createElement('div');
    commentInputContainer.classList = 'flex items-center p-4 bg-gray-700';
    commentInputContainer.innerHTML = `
      <input 
        id="newCommentInput"
        type="text"
        placeholder="Write a comment..."
        class="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button 
        id="${postId}"
        class="addCommentBtn ml-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Add Comment
      </button>
    `;
    popupContainer.appendChild(commentInputContainer);

    document.body.appendChild(popupOverlay);

    // Load Comments Function
    const loadComments = async (postId) => {
      if (isLoading || !hasNextPage) return; // Stop if already loading or no more comments
      isLoading = true;

      try {
        const response = await fetch(`${URL}/api/v1/comments/p/${postId}`, {
          method: 'get',
          credentials: 'include',
        }); // Replace with your API endpoint
        const responseData = await response.json();

        if (responseData.success && responseData.data.docs.length > 0) {
          responseData.data.docs.forEach((comment) => {
            const commentBox = document.createElement('div');
            commentBox.classList =
              'mb-4 p-3 bg-gray-700 rounded-lg flex items-start justify-between';

            const avatar = comment.owner[0].avatar;
            const userName = comment.owner[0].userName;
            const content = comment.content;

            commentBox.innerHTML = `
              <div class="flex items-start w-full">
                <img src="${avatar}" alt="${userName}" class="w-10 h-10 rounded-full mr-4">
                <div class="w-full">
                  <p class="text-sm font-bold capitalize">${userName}</p>
                  <p class="text-sm text-gray-300">${content}</p>
                </div>
                <div class="relative">
                  <button class="text-gray-400 hover:text-blue-500 text-xl" id="threeDotBtn-${comment._id}">
                    &#8942;
                  </button>
                  <div id="dropdown-${comment._id}" class="hidden absolute top-0 right-0 mt-6 bg-gray-800 rounded-lg shadow-md w-40">
                    <button class="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">Edit</button>
                    <button class="block w-full text-left px-4 py-2 text-sm text-white hover:bg-red-600">Delete</button>
                  </div>
                </div>
              </div>
              <button class="text-gray-400 hover:text-blue-500 flex items-center mt-2 absolute bottom-2 left-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-5 h-5 mr-1" viewBox="0 0 16 16">
                  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm3.468 4.646a.5.5 0 0 1 .34.874l-3.25 2.5a.5.5 0 0 1-.63 0l-3.25-2.5a.5.5 0 1 1 .63-.874L8 8.122l3.468-2.476z"/>
                </svg>
                Like
              </button>
            `;
            commentsContainer.appendChild(commentBox);

            // Event Listener for Three Dot Menu
            document
              .getElementById(`threeDotBtn-${comment._id}`)
              .addEventListener('click', () => {
                const dropdown = document.getElementById(
                  `dropdown-${comment._id}`
                );
                dropdown.classList.toggle('hidden');
              });
          });

          // Check if there are more pages of comments
          hasNextPage = responseData.data.hasNextPage;
          currentPage++;

          // Stop infinite scroll if there are no more pages
          if (!hasNextPage) {
            const endMessage = document.createElement('p');
            endMessage.classList = 'text-center text-gray-400 mt-4';
            endMessage.textContent = 'No more comments to load';
            commentsContainer.appendChild(endMessage);
          }
        } else if (currentPage === 1) {
          commentsContainer.innerHTML = `
            <p class="text-gray-400 text-center mt-10">No Comments Found</p>
          `;
        }
      } catch (error) {
        if (currentPage === 1) {
          commentsContainer.innerHTML = `
            <p class="text-gray-400 text-center mt-10">Error fetching comments. Please try again later.</p>
          `;
        }
      } finally {
        isLoading = false;
      }
    };

    // Add Comment Handler
    const addComment = async (postId) => {
      const newComment = document
        .getElementById('newCommentInput')
        .value.trim();

      if (newComment === '') return alert('Comment cannot be empty');

      try {
        const response = await fetch(`${URL}/api/v1/comments/p/${postId}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: newComment }),
        });

        const responseData = await response.json();

        if (responseData.success) {
          alert('Comment added successfully');
          document.getElementById('newCommentInput').value = '';
          commentsContainer.innerHTML = ''; // Clear and reload comments
          currentPage = 1;
          hasNextPage = true;
          await loadComments(postId);
        } else {
          alert('Failed to add comment');
        }
      } catch (error) {
        console.log(error);
        alert('An error occurred. Please try again later.', error);
      }
    };

    // Infinite Scroll Handler
    commentsContainer.addEventListener('scroll', (postId) => {
      if (
        commentsContainer.scrollTop + commentsContainer.clientHeight >=
        commentsContainer.scrollHeight - 10
      ) {
        loadComments(postId);
      }
    });

    // Event Listeners
    document.getElementById('closePopup').addEventListener('click', () => {
      popupOverlay.remove();
    });

    const addCmtBtn = document.querySelector('.addCommentBtn');
    console.log(addCmtBtn.id);

    addCmtBtn.addEventListener('click', () => {
      addComment(addCmtBtn.id);
    });

    // Load Initial Comments
    await loadComments(postId);
  };

  // Show Comments Popup
  const commentsBtns = document.querySelectorAll('.commentsBtn');
  if (commentsBtns) {
    commentsBtns.forEach((commentBtn) => {
      commentBtn.addEventListener('click', (e) => {
        showCommentsPopup(e.target.id);
      });
    });
  }
});
