import { URL } from '../export/export.variable.js';
// Get the value from the query parameters
const urlParams = new URLSearchParams(
  window.location.href.split('?').slice(1).join('&')
);

// Convert parameters into an object
const params = {};
urlParams.forEach((value, key) => {
  params[key] = value;
});

// <!--------------------------- CurrentUserData  ---------------------------------->

const currentUserTotalData = async () => {
  const responseUser = await fetch(`${URL}/api/v1/users/current-user`, {
    method: 'get',
    credentials: 'include',
  });
  const userData = await responseUser.json();

  return userData;
};

// <!--------------------------- fetch UserData  ---------------------------------->
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

// <!-----------------------   check UserData for updateProfile  ------------------------>
const updateProfileAuthorization = async () => {
  const profileUserData = await fetchUserData();
  const currentUserData = await currentUserTotalData();

  if (profileUserData.data._id != currentUserData.data._id) {
    const profileUpdateBtn = document.querySelector('.profileUpdateBtn');

    if (profileUpdateBtn) {
      profileUpdateBtn.classList.add('hidden');
    }
  }
};

updateProfileAuthorization();

// <!--------------------------- set UserData  ---------------------------------->
const setUserData = async () => {
  // fetch data
  const data = await fetchUserData();

  // Set all fetched data into frontend
  document.querySelector('#avatar').src = data.data.avatar;
  document.querySelector('#coverImage').style.cssText = `
    background-image: url(${data.data.coverImage});
    background-size: cover;
`;
  document.querySelector('#userName').innerText = data.data.userName;
  document.querySelector('#subscriberCount').innerText =
    data.data.subscriberCount;
  document.querySelector('#email').innerText = data.data.email;
};

setUserData();

// <!----------------------- SubscribeToggle -------------------------------->
const subscribeButton = document.getElementById('subscribeButton');

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

    const compareData = params.query;

    const idSet = new Set(channelIds);
    if (idSet.has(compareData)) {
      subscribed();
    } else {
      subscribe();
    }
  };
  subscriberTogglerFunction();

  // Add event listener for manual toggling for Subscribe
  subscribeButton.addEventListener('click', async () => {
    const videoOwnerData = params.query;

    const response = await fetch(
      `${URL}/api/v1/subscription/c/${videoOwnerData}`,
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
    setUserData();
  });
};

subscribeHandler();
