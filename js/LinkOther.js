document.addEventListener('DOMContentLoaded', function() {
  const likeBtn = document.querySelector('.like-btn');
  const commentBtn = document.querySelector('.comment-btn');
  const commentInput = document.querySelector('#comment-input');
  const submitCommentBtn = document.querySelector('.submit-comment-btn');
  const commentsList = document.querySelector('.comments-list');
  const likeCountElem = document.querySelector('.like-count');
  const shareBtn = document.querySelector('.share-btn');

  // Get the current URL
  const currentUrl = window.location.href;

  // Initialize likes and comments from localStorage
  let likeCount = parseInt(localStorage.getItem(`likeCount_${currentUrl}`)) || 0;
  let userLiked = localStorage.getItem(`userLiked_${currentUrl}`) === 'true';
  let savedComments = JSON.parse(localStorage.getItem(`comments_${currentUrl}`)) || [];

  // Update the like count in the UI
  likeCountElem.textContent = likeCount;

  // Restore comments
  savedComments.forEach((comment, index) => {
    addCommentToDOM(comment, index);
  });

  likeBtn.addEventListener('click', function() {
    if (userLiked) {
      likeCount--;
      userLiked = false;
    } else {
      likeCount++;
      userLiked = true;
    }
    likeCountElem.textContent = likeCount;
    localStorage.setItem(`likeCount_${currentUrl}`, likeCount);
    localStorage.setItem(`userLiked_${currentUrl}`, userLiked);
  });

  commentBtn.addEventListener('click', function() {
    const isHidden = commentInput.style.display === 'none';
    commentInput.style.display = isHidden ? 'block' : 'none';
    submitCommentBtn.style.display = isHidden ? 'block' : 'none';
  });

  submitCommentBtn.addEventListener('click', function() {
    const comment = commentInput.value.trim();
    if (comment) {
      const index = savedComments.length;
      savedComments.push(comment);
      localStorage.setItem(`comments_${currentUrl}`, JSON.stringify(savedComments));
      addCommentToDOM(comment, index);
      commentInput.value = '';
    }
    commentInput.style.display = 'none';
    submitCommentBtn.style.display = 'none';
  });

  shareBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const storyUrl = window.location.href;
    const storyTitle = document.title;
    const shareText = `Check out this amazing story: ${storyTitle}\n\n${storyUrl}`;

    if (navigator.share) {
      navigator.share({
        title: storyTitle,
        text: shareText,
        url: storyUrl
      }).catch(console.error);
    } else {
      window.alert(`Please copy and share the following:\n\n${shareText}`);
    }
  });

  function addCommentToDOM(comment, index) {
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    commentElement.dataset.index = index;
    commentElement.innerHTML = `
      <p class="comment-text">${comment}</p>
      <div class="comment-buttons">
        <button class="comment-button edit-btn">✏️ Edit</button>
        <button class="comment-button delete-btn">🗑️ Delete</button>
      </div>
    `;

    commentsList.appendChild(commentElement);

    const editBtn = commentElement.querySelector('.edit-btn');
    const deleteBtn = commentElement.querySelector('.delete-btn');

    editBtn.addEventListener('click', function() {
      const commentText = commentElement.querySelector('.comment-text');
      const currentText = commentText.textContent;
      const editTextarea = document.createElement('textarea');
      editTextarea.classList.add('comment-input-edit');
      editTextarea.value = currentText;
      commentElement.replaceChild(editTextarea, commentText);

      editTextarea.addEventListener('blur', function() {
        const updatedText = editTextarea.value.trim();
        if (updatedText) {
          savedComments[index] = updatedText;
          localStorage.setItem(`comments_${currentUrl}`, JSON.stringify(savedComments));
          commentText.textContent = updatedText;
        }
        commentElement.replaceChild(commentText, editTextarea);
      });
    });

    deleteBtn.addEventListener('click', function() {
      commentsList.removeChild(commentElement);
      savedComments.splice(index, 1);
      localStorage.setItem(`comments_${currentUrl}`, JSON.stringify(savedComments));
      updateCommentsIndex();
    });
  }

  function updateCommentsIndex() {
    const commentElements = commentsList.querySelectorAll('.comment');
    commentElements.forEach((commentElement, index) => {
      commentElement.dataset.index = index;
    });
  }
});