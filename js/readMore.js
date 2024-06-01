const readMoreBtn = document.querySelector('.read-more-btn');
const moreContent = document.querySelector('.more-content');

readMoreBtn.addEventListener('click', function(e) {
    e.preventDefault();
    moreContent.style.display = moreContent.style.display === 'none' ? 'block' : 'none';
    readMoreBtn.textContent = moreContent.style.display === 'none' ? 'Read More' : 'Read Less';
});