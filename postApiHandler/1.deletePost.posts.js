import { URL } from '../export/export.variable.js';

const deletePostHandler = async (postId) => {
  try {
    const response = await fetch(`${URL}/api/v1/posts/${postId}`, {
      method: 'delete',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      alert('Post Delete Succesfully!');
      location.reload();
    } else {
      alert('Something went wrong!');
      location.reload();
    }
  } catch (error) {
    alert('something went wrong while delete Video: ', error);
    location.reload();
  }
};

export { deletePostHandler };
