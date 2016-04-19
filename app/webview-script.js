require('mousetrap');
require('sweetalert');
const clipboard = require('electron').clipboard;

// Which page type we are on
function page_type() {
  if (/^\/podcasts/.test(window.location.pathname)) { return 'home' }
  else if  (/^\/\+/.test(window.location.pathname)) { return 'episode' }
  else { return 'list' }
}

// Episode cell functions
function is_episode_cell(cell) {
  if (cell.getAttribute('class') === 'episodecell') {
    return true;
  } else {
    return false;
  }
}

function focus_cell(cell) {
  if (is_episode_cell(cell)) {
    cell.style.backgroundColor = 'rgba(252, 126, 15, 0.05)';
    cell.focus();
  }
}

function blur_cell(cell) {
  if (is_episode_cell(cell)) {
    cell.style.backgroundColor = null;
  }
}

function navigate_cells(direction) {
  let current_cell = document.activeElement;
  let down_cell = current_cell.nextElementSibling;
  let up_cell = current_cell.previousElementSibling;
  let next_cell;

  if (is_episode_cell(current_cell)) { // Pick next cell if already on one
    direction === 'down' ? next_cell = down_cell : next_cell = up_cell;
    // Blur current cell, only if next cell is an episode cell (if it’s not, we’ve reached to top or bottom of the list), and focus on next one
    if (is_episode_cell(next_cell)) blur_cell(current_cell);
    focus_cell(next_cell);
  } else { // Or go directly to the top or bottom of list
    const episode_cells = document.getElementsByClassName('episodecell');
    const top_cell = document.getElementsByClassName('episodecell')[0];
    const bottom_cell = episode_cells[episode_cells.length - 1];
    direction === 'down' ? focus_cell(top_cell) : focus_cell(bottom_cell);
  }
}

// Non-global shortcuts
Mousetrap.bind('backspace', function() {
  window.location.href = 'https://overcast.fm/podcasts/';
});

Mousetrap.bind('command+backspace', function() {
  if (page_type() === 'episode') {
    document.getElementById('delete_episode_button').click();
  } else if (page_type() === 'list') {
    document.getElementsByClassName('destructivebutton')[0].click();
  }
});

Mousetrap.bind('command+return', function() {
  if (page_type() === 'episode') document.getElementById('save_episode_button').click();
});

Mousetrap.bind('space', function(event) {
  event.preventDefault();

  if (page_type() === 'episode') {
    document.getElementById('playpausebutton').click();
  }
});

// Navigate episode cells
Mousetrap.bind(['down', 'j'], function() {
  navigate_cells('down');
});

Mousetrap.bind(['up', 'k'], function() {
  navigate_cells('up');
});

// Copy share links to clipboard
function copy_link(event, share_anchor) {
  event.preventDefault();
  const share_link = share_anchor.href;

  // Copy link and show notification
  clipboard.writeText(share_link);
  swal({ title: 'Link copied to clipboard', type: 'success', text: share_link, timer: 1000, showConfirmButton: false });
}

document.addEventListener('DOMContentLoaded', function() {
  if (page_type() === 'home') {
    // Remove outlines around episode cells
    const episode_cells = document.getElementsByClassName('episodecell');
    for(let current_cell = 0, all_cells = episode_cells.length; current_cell < all_cells; current_cell++) {
      episode_cells[current_cell].style.outline = 'none';
    };
  } else if (page_type() === 'episode') {
    // Modify external links
    const external_anchors = document.querySelectorAll('a[href^="http"]');

    // Name them
    const permalink = external_anchors[0];
    const share = external_anchors[1];
    const share_with_timestamp = external_anchors[2];

    // Open permalink in new window (will be caught and opened in default browser)
    permalink.target = "_blank";

    share.addEventListener('click', function() { copy_link(event, share) });
    share_with_timestamp.addEventListener('click', function() { copy_link(event, share_with_timestamp) });

    // Delete episode after playing
    document.getElementById('audioplayer').addEventListener('ended', function() {
      document.getElementById('delete_episode_button').click();
    });
  }
});
