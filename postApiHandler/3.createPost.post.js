import { URL } from '../export/export.variable.js';

const postForm = document.querySelector('#postForm');
const loader = document.getElementById('loader');

// Handle post uplaod form
const postUploadHandler = async (e) => {
  e.preventDefault();

  // Show the loader
  loader.classList.remove('hidden');

  //   get all the data from frontend
  const formData = new FormData(e.target);

  console.log(formData);

  try {
    const response = await fetch(`${URL}/api/v1/posts/`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const responseMsg = await response.json();

    if (!response.ok) {
      alert(responseMsg || 'Post Upload failed! Please try again.');
      location.reload();
    } else {
      alert(responseMsg.message || 'Post Uploaded Succesfully!');
      location.href = `./homepageVid.html`;
    }
  } catch (error) {
    alert(error || 'Post Upload failed! Please try again.');
    location.reload();
  } finally {
    // Hide the loader after data is fetched or error occurs
    loader.classList.add('hidden');
  }
};

postForm.addEventListener('submit', postUploadHandler);
