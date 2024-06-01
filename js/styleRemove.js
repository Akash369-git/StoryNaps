
const storyRows = document.querySelectorAll('.story_table tbody tr');
storyRows.forEach(row => {
  row.addEventListener('click', () => {
    const storyUrl = row.getAttribute('data-url');
    window.location.href = storyUrl;
  });
  row.addEventListener('mouseover', () => {
row.style.cursor = 'pointer';
});

// Add a mouseout event listener to reset the cursor style
row.addEventListener('mouseout', () => {
row.style.cursor = 'default';
});
});