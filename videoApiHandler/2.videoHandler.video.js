import { URL } from '../export/export.variable.js';

// Get the value from the query parameters
const urlParams = new URLSearchParams(window.location.search);
export const videoId = urlParams.get('query');

const subscribeButton = document.getElementById('subscribeButton');
const subscriberCount = document.querySelector('#ownerSubscriber');

// <!---------------------------VideoData ---------------------------------->

const videoTotalFetchData = async () => {
  const response = await fetch(`${URL}/api/v1/videos/${videoId}`, {
    method: 'get',
    credentials: 'include',
  });
  const data = await response.json();

  const subscriberResponse = await fetch(
    `${URL}/api/v1/subscription/c/${data.data[0].videoOwner[0]._id}`,
    {
      method: 'get',
      credentials: 'include',
    }
  );
  const subscriberData = await subscriberResponse.json();
  subscriberCount.textContent = `${subscriberData.data} Subscriber`;

  return data;
};

// <!--------------------------- CurrentUserData  ---------------------------------->

const currentUserTotalData = async () => {
  const responseUser = await fetch(`${URL}/api/v1/users/current-user`, {
    method: 'get',
    credentials: 'include',
  });
  const userData = await responseUser.json();

  return userData;
};

// <!---------------------------  edit Title/descriptin check  ---------------------------------->

const editUserAndDeleteVidAuthorizationHandler = async () => {
  const videoOwnerData = await videoTotalFetchData();
  const currentUserData = await currentUserTotalData();

  if (videoOwnerData.data[0].videoOwner[0]._id != currentUserData.data._id) {
    document.querySelector('#editVideoBtn').classList.add('hidden');
    document.querySelector('#deleteVideoBtn').classList.add('hidden');
  }
};

editUserAndDeleteVidAuthorizationHandler();

// <!--------------------------- Video Handle  ---------------------------------->

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

const videoHander = async () => {
  const data = await videoTotalFetchData();
  const timeAgo = calculateTimeAgo(data.data[0].createdAt);

  document.querySelector('#mainVideo').src = `${data.data[0].videoFile}`;

  document.querySelector('#videoTitle').textContent = `${data.data[0].title}`;

  document.querySelector(
    '#videoInfo'
  ).textContent = `${data.data[0].views} views • ${timeAgo}`;

  document.querySelector('#videoDescription').textContent =
    data.data[0].description;

  const toTitleCase = (str) => {
    return str
      .toLowerCase() // Ensure the string is in lowercase first
      .split(' ') // Split the string into an array of words
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1); // Capitalize the first letter of each word
      })
      .join(' '); // Join the words back into a single string
  };

  document.querySelector('#videoOwner').textContent = toTitleCase(
    data.data[0].videoOwner[0].userName
  );

  document.querySelector('#ownerAvatar').src =
    data.data[0].videoOwner[0].avatar;
};

videoHander();

// <!----------------------- SubscribeToggle -------------------------------->
const subscribeHandler = async () => {
  const subscribe = () => {
    subscribeButton.textContent = 'Subscribe';
    subscribeButton.classList.remove('subscribed');
    subscribeButton.classList.add('subscribe');
  };

  const subscribed = () => {
    subscribeButton.textContent = 'Subscribed';
    subscribeButton.classList.add('subscribed');
    subscribeButton.classList.remove('subscribe');
  };

  const userData = await currentUserTotalData();

  const subscriberTogglerFunction = async () => {
    const responseCheckSubscribed = await fetch(
      `${URL}/api/v1/subscription/u/${userData.data._id}`,
      {
        method: 'get',
        credentials: 'include',
      }
    );

    const checkSubscribedData = await responseCheckSubscribed.json();

    // add all channel's _id's in an single array
    const channelIds = checkSubscribedData.data.reduce((acc, item) => {
      const channelIds = item.Channels.map((channel) => channel._id);
      return acc.concat(channelIds);
    }, []);

    const compareData = await videoTotalFetchData();

    const idSet = new Set(channelIds);
    if (idSet.has(compareData.data[0].videoOwner[0]._id)) {
      subscribed();
    } else {
      subscribe();
    }
  };
  subscriberTogglerFunction();

  // Add event listener for manual toggling for Subscribe
  subscribeButton.addEventListener('click', async () => {
    const videoOwnerData = await videoTotalFetchData();

    const response = await fetch(
      `${URL}/api/v1/subscription/c/${videoOwnerData.data[0].videoOwner[0]._id}`,
      {
        method: 'post',
        credentials: 'include',
      }
    );

    const data = await response.json();
    if (data) {
      subscribed();
    }
    if (!data) {
      subscribe();
    }

    subscriberTogglerFunction();
  });
};

subscribeHandler();

// <!------------------------ LikeButtonToggle ------------------------------->
const videoLikeHandler = async () => {
  const likeButton = document.getElementById('likeButton');

  const like = () => {
    likeButton.classList.replace('bg-indigo-500', 'bg-gray-600');
  };

  const liked = () => {
    likeButton.classList.replace('bg-gray-600', 'bg-indigo-500');
  };

  const videoLikeTogglerFunction = async () => {
    const response = await fetch(`${URL}/api/v1/likes/videos`, {
      method: 'get',
      credentials: 'include',
    });

    const data = await response.json();

    let isLiked = true;

    // Extract all likedVideos _id
    const likedVideoIds = data.data.map((item) =>
      item.likedVideos.map((video) => video._id)
    );

    // Flatten the array
    const flatLikedVideoIds = likedVideoIds.flat();

    flatLikedVideoIds.forEach((element, index) => {
      if (element == videoId) {
        isLiked = true;
        liked();
        return;
      }
    });

    if (!isLiked) {
      isLiked = false;
      like();
    }
  };

  videoLikeTogglerFunction();

  // Add event listener for manual toggling
  likeButton.addEventListener('click', async () => {
    const response = await fetch(`${URL}/api/v1/likes/toggle/v/${videoId}`, {
      method: 'post',
      credentials: 'include',
    });

    const data = await response.json();
    if (data.data) {
      liked();
    }
    if (!data.data) {
      like();
    }
  });
};

videoLikeHandler();

// <!------------------------ DeleteVideo ------------------------------------>
const deleteVideoBtn = document.querySelector('#deleteVideoBtn');
const loader = document.getElementById('loader');

const videoDeleteHandler = async () => {
  // Show the loader
  loader.classList.remove('hidden');

  try {
    const response = await fetch(`${URL}/api/v1/videos/${videoId}`, {
      method: 'delete',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      alert('Video Delete Succesfully!');
      location.href = `./homepageVid.html`;
    } else {
      alert(response.message);
      location.reload();
    }
  } catch (error) {
    alert('something went wrong while delete Video: ', error);
  } finally {
    // Hide the loader after data is fetched or error occurs
    loader.classList.add('hidden');
  }
};

deleteVideoBtn.addEventListener('click', videoDeleteHandler);

// <!---------------------- DialogBox(Editvideo) ----------------------->
const dialogBox = document.getElementById('dialogBox');
const titleInput = document.getElementById('titleInput');
const descriptionInput = document.getElementById('descriptionInput');
const formSubmit = document.getElementById('updateVideoForm');
const dialogCancelButton = document.getElementById('dialogCancel');

const openDialog = () => {
  dialogBox.classList.remove('hidden'); // Show the dialog
};

const closeDialog = () => {
  dialogBox.classList.add('hidden'); // Hide the dialog
  titleInput.value = ''; // Clear title input
  descriptionInput.value = ''; // Clear description input
};

// Event listener for save button
formSubmit.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Show the loader
  loader.classList.remove('hidden');

  // get form data on submisssion
  const formData = new FormData(e.target);

  try {
    const response = await fetch(`${URL}/api/v1/videos/${videoId}`, {
      method: 'PATCH',
      credentials: 'include',
      body: formData, // Send the form data
    });

    const responseMsg = await response.json();

    if (!response.ok) {
      alert(responseMsg || 'Video Updation failed. Please try again!');
      location.reload();
    } else {
      alert(responseMsg.message || 'Video Updated Succesfully!');
      location.reload();
    }
  } catch (error) {
    alert('something went wrong while Update the Video: ', error);
  } finally {
    // Hide the loader after data is fetched or error occurs
    loader.classList.add('hidden');
  }
});

dialogCancelButton.addEventListener('click', closeDialog);

document.querySelector('#editVideoBtn').addEventListener('click', openDialog);
