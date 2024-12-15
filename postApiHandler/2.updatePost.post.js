import { URL } from '../export/export.variable.js';

// Function to create and display a dialog box
const showDialog = async (postId) => {
  // method for handle update button
  const handleUpdate = async (postId, content) => {
    const bodyData = {
      content: content,
    };

    const response = await fetch(`${URL}/api/v1/posts/${postId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    if (response.ok) {
      alert('Post Data updated succesfully!');
      location.reload();
    } else {
      alert('Something went wrong!');
      location.reload();
    }
  };

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className =
    'fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50';

  // Create dialog box
  const dialogBox = document.createElement('div');
  dialogBox.className =
    'bg-gray-900 border border-gray-800 rounded-lg shadow-lg max-w-sm w-full p-6';

  // Create title
  const dialogTitle = document.createElement('h2');
  dialogTitle.className = 'text-lg font-bold mb-4';
  dialogTitle.textContent = 'Edit Post';

  // Create input container
  const inputContainer = document.createElement('div');
  inputContainer.className = 'relative mt-4';

  // Create input box
  const inputBox = document.createElement('textarea');
  // inputBox.type = 'text';
  inputBox.id = 'descriptionInput';
  inputBox.name = 'title';
  inputBox.className =
    'w-full h-[150px] p-4 mb-8 bg-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-500';

  // Create label for input
  const inputLabel = document.createElement('label');
  inputLabel.htmlFor = 'descriptionInput';
  inputLabel.className =
    'absolute -top-2 left-3 px-1 text-xs bg-gray-900 text-white';
  inputLabel.textContent = 'Post Description';

  // Append input and label to container
  inputContainer.appendChild(inputBox);
  inputContainer.appendChild(inputLabel);

  // Create buttons container
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'flex justify-between mt-6';

  // Create Cancel button
  const cancelButton = document.createElement('button');
  cancelButton.className =
    'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600';
  cancelButton.textContent = 'Cancel';
  cancelButton.onclick = () => {
    document.body.removeChild(overlay);
  };

  // Create update button
  const updateButton = document.createElement('button');
  updateButton.className =
    'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
  updateButton.textContent = 'update';
  updateButton.onclick = async () => {
    const titleValue = inputBox.value; // Get input value
    await handleUpdate(postId, titleValue);
    document.body.removeChild(overlay);
  };

  // Append elements to dialog box
  buttonsContainer.appendChild(cancelButton);
  buttonsContainer.appendChild(updateButton);
  dialogBox.appendChild(dialogTitle);
  dialogBox.appendChild(inputContainer);
  dialogBox.appendChild(buttonsContainer);

  // Append dialog box to overlay
  overlay.appendChild(dialogBox);

  // Append overlay to body
  document.body.appendChild(overlay);
};

export { showDialog };
