import { URL } from '../export/export.variable.js';

const coverImage = document.querySelector('#coverImageForm');
const avatarForm = document.querySelector('#avatarForm');
const profileForm = document.querySelector('#profileForm');

// Handle Cover Imagee
const coverImageHandler = async (e) => {
  e.preventDefault();

  // Get form elements
  const formData = new FormData(e.target); // Automatically captures all fields

  //   Send the form data using fetch
  try {
    // Update CovarImage
    if (formData.has('coverImage')) {
      const responseCoverImage = await fetch(
        `${URL}/api/v1/users/cover-image`,
        {
          method: 'PATCH',
          credentials: 'include',
          body: formData, // Send the form data
        }
      );

      const responseMsg = await responseCoverImage.json();

      if (!responseCoverImage.ok) {
        alert(responseMsg || 'Cover Image Updation failed. Please try again.');
        location.reload();
      } else {
        alert(responseMsg.message || 'Cover Image Updated Succesfully.');
        location.reload();
      }
    }
  } catch (error) {
    alert(error || 'Profile Updation failed. Please try again.');
    location.reload();
  }
};

// Handle avatar
const avatarHandler = async (e) => {
  e.preventDefault();

  // Get form elements
  const formData = new FormData(e.target); // Automatically captures all fields

  //   Send the form data using fetch
  try {
    // Update avatar
    const responseAvatar = await fetch(`${URL}/api/v1/users/avatar`, {
      method: 'PATCH',
      credentials: 'include',
      body: formData, // Send the form data
    });

    const responseMsg = await responseAvatar.json();

    if (!responseAvatar.ok) {
      alert(responseMsg || 'Avatar Updation failed. Please try again.');
      location.reload();
    } else {
      alert(responseMsg.message || 'Avatar Updated Succesfully.');
      location.reload();
    }
  } catch (error) {
    alert(error || 'Profile Updation failed. Please try again.');
    location.reload();
  }
};

// Handle Profile Update
const profileFormHandler = async (e) => {
  e.preventDefault();

  // Get form elements
  const formData = new FormData(e.target); // Automatically captures all fields

  let formDataObj = {};

  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });

  //   Send the form data using fetch

  try {
    // Update fullName and userName
    const responseFullNameandUserName = await fetch(
      `${URL}/api/v1/users/update-account`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObj), // Send the form data
      }
    );

    const responseMsg = await responseFullNameandUserName.json();

    if (!responseFullNameandUserName.ok) {
      alert(responseMsg || 'Profile Updation failed. Please try again.');
      location.reload();
    } else {
      alert(responseMsg.message || 'Profile Updated Succesfully.');
      location.reload();
    }
  } catch (error) {
    alert(error || 'Profile Updation failed. Please try again.');
    location.reload();
  }
};

// add Register method on submit form
coverImage.addEventListener('submit', coverImageHandler);
avatarForm.addEventListener('submit', avatarHandler);
profileForm.addEventListener('submit', profileFormHandler);
