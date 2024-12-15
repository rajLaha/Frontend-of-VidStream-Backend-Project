import { videoId } from '../videoApiHandler/2.videoHandler.video.js';
import { URL } from '../export/export.variable.js';

// <!-- JavaScript for Adding Comments -->
const commentBody = document.querySelector('#commentInput');
const addCommentBtn = document.querySelector('#submitComment');
const commentsSection = document.getElementById('commentsSection');
const noCommentsText = document.getElementById('noComments');

addCommentBtn.addEventListener('click', async () => {
  const responseData = {
    content: `${commentBody.value}`,
  };

  await fetch(`${URL}/api/v1/comments/${videoId}`, {
    method: 'post',
    credentials: 'include',
    body: JSON.stringify(responseData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  location.reload();
});

const commentsFetchAndShowHandler = async (limit) => {
  const response = await fetch(
    `${URL}/api/v1/comments/${videoId}?limit=${limit}`,
    {
      method: 'get',
      credentials: 'include',
    }
  );

  const data = await response.json();

  const totalDocsData = data.data;

  return totalDocsData;
};

function generateComments(totalDocsData) {
  let commentCount = totalDocsData.docs.length;
  if (commentCount > 0) {
    noCommentsText.style.display = 'none';
    for (let i = 0; i < commentCount; i++) {
      const commentElement = document.createElement('div');
      commentElement.classList.add(
        'bg-gray-700',
        'p-3',
        'rounded-lg',
        'flex',
        'space-x-4'
      );

      commentElement.innerHTML = `
          <img src="" class="rounded-full w-10 h-10 commentAvatar" />
          <div>
            <p class="text-gray-200 font-semibold commentUser" >Default</p>
            <p class="text-gray-400 commentContent" >Default</p>
            <div class="flex items-center space-x-4 mt-2">
              <button class="text-indigo-500 flex items-center space-x-2 commentLikeBtn" >
                <i class="fa-solid fa-thumbs-up"></i>
                <span>Like</span>
              </button>
            </div>
          </div>
        `;

      commentsSection.appendChild(commentElement);
    }

    // fix the dummy video tiles with fetched value

    // i)  Comment
    document.querySelectorAll('.commentContent').forEach((el, index) => {
      if (totalDocsData.docs[index] != undefined) {
        el.textContent = totalDocsData.docs[index].content;
      }
    });

    // ii)  Comment owner avatar
    document.querySelectorAll('.commentAvatar').forEach((el, index) => {
      if (totalDocsData.docs[index].ownerDetails[0].avatar != undefined) {
        el.src = totalDocsData.docs[index].ownerDetails[0].avatar;
      }
    });

    // iii)  Comment owner
    document.querySelectorAll('.commentUser').forEach((el, index) => {
      if (totalDocsData.docs[index].ownerDetails[0].fullName != undefined) {
        el.textContent = totalDocsData.docs[index].ownerDetails[0].fullName;
      }
    });
  } else {
    noCommentsText.style.display = 'block';
  }
}

const fetchedDataD = async function () {
  const fetchedData = await commentsFetchAndShowHandler();
  const actualFetchedData = await commentsFetchAndShowHandler(
    fetchedData.totalDocs
  );

  generateComments(actualFetchedData);
};

fetchedDataD();
