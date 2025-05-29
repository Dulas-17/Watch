// --- New/Modified JavaScript for Remembering State ---

// Function to save the current scroll position of the document
function saveScrollPosition() {
    localStorage.setItem('scrollPosition', window.scrollY);
}

// Function to restore scroll position for the entire window
function restoreScrollPosition() {
    const storedScrollY = localStorage.getItem('scrollPosition');
    if (storedScrollY) {
        window.scrollTo(0, parseInt(storedScrollY, 10));
    }
}

// Function to save the active section and optional detail index
function saveState(sectionId, detailType = null, detailIndex = null) {
    localStorage.setItem('lastActiveSection', sectionId);
    if (detailType !== null && detailIndex !== null) {
        localStorage.setItem('lastDetailType', detailType);
        localStorage.setItem('lastDetailIndex', detailIndex);
    } else {
        localStorage.removeItem('lastDetailType');
        localStorage.removeItem('lastDetailIndex');
    }
    saveScrollPosition(); // Save scroll position whenever state changes
}

// Modified showSection to also save the section ID
function showSection(id) {
  alert('showSection called with ID: ' + id); // DEBUG ALERT
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  saveState(id); // Save the active section

  // Ensure nav and search are visible when switching sections normally
  document.querySelector('nav').style.display = 'flex'; // Assuming nav is flex or block
  document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'block'); // Assuming search-box is block

  if (id === 'series') {
    showSeriesList();
    document.getElementById('seriesDetails').style.display = 'none';
  } else if (id === 'movies') {
    showMovieList();
    document.getElementById('movieDetails').style.display = 'none';
  } else if (id === 'watchLater') { // Call showWatchLaterList when 'watchLater' section is active
    alert('Calling showWatchLaterList from showSection...'); // DEBUG ALERT
    showWatchLaterList();
  }
  window.scrollTo(0, 0); // Scroll to top of new section
}

// Original searchContent remains the same
function searchContent(type) {
  const input = document.getElementById(type === 'series' ? 'seriesSearch' : 'movieSearch').value.toLowerCase();
  const filtered = content[type].filter(item => item.title.toLowerCase().includes(input));
  if (type === 'series') showSeriesList(filtered);
  else showMovieList(filtered);
  saveScrollPosition(); // Save scroll position after search
}

// Original showSeriesList remains the same, but we will call it during page load
function showSeriesList(list = content.series) {
  const container = document.getElementById('seriesList');
  container.innerHTML = '';
  list.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'series-item';
    div.innerHTML = `
      <img src="${s.image}" alt="${s.title}" />
      <h4>${s.title}</h4>
      <button onclick="showSeriesDetails(${i})" class="btn">Open</button>
      <button onclick="addToWatchLater(${i}, 'series')" class="btn">Watch Later</button>
    `;
    container.appendChild(div);
  });
  if (list === content.series && localStorage.getItem('lastActiveSection') === 'series' && !localStorage.getItem('lastDetailType')) {
      restoreScrollPosition();
  }
}

// Original showMovieList remains the same, but we will call it during page load
function showMovieList(list = content.movies) {
  const container = document.getElementById('movieList');
  container.innerHTML = '';
  list.forEach((m, i) => {
    const div = document.createElement('div');
    div.className = 'series-item';
    div.innerHTML = `
      <img src="${m.image}" alt="${m.title}" />
      <h4>${m.title}</h4>
      <button onclick="showMovieDetails(${i})" class="btn">Watch</button>
      <button onclick="addToWatchLater(${i}, 'movie')" class="btn">Watch Later</button>
    `;
    container.appendChild(div);
  });
  if (list === content.movies && localStorage.getItem('lastActiveSection') === 'movies' && !localStorage.getItem('lastDetailType')) {
      restoreScrollPosition();
  }
}

// Modified showSeriesDetails to save the series index
function showSeriesDetails(i) {
  alert('showSeriesDetails called for index: ' + i); // DEBUG ALERT
  const s = content.series[i];
  const container = document.getElementById('seriesDetails');
  document.getElementById('seriesList').innerHTML = ''; // Clear list when showing details
  container.innerHTML = `
    <img src="${s.image}" alt="${s.title}" />
    <h2>${s.title}</h2>
    <p>${s.description}</p>
    <div class="episode-buttons">
      ${s.episodes.map(ep => `<button onclick="playEpisode('${ep.link}')">${ep.title}</button>`).join('')}
    </div>
    <button onclick="goBackToList('series')"class="btn">Back</button>
  `;
  container.style.display = 'block'; // Ensure container is visible
  alert('seriesDetails display set to block: ' + container.style.display); // DEBUG ALERT
  saveState('series', 'series', i); // Save active section, detail type, and index
  window.scrollTo(0, 0); // Scroll to top of details

  // HIDE navigation and search bar
  document.querySelector('nav').style.display = 'none';
  document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'none');
}

// Modified showMovieDetails to save the movie index
function showMovieDetails(i) {
  alert('showMovieDetails called for index: ' + i); // DEBUG ALERT
  const m = content.movies[i];
  const container = document.getElementById('movieDetails');
  document.getElementById('movieList').innerHTML = ''; // Clear list when showing details
  container.innerHTML = `
    <img src="${m.image}" alt="${m.title}" />
    <h2>${m.title}</h2>
    <p>${m.description}</p>
    <div class="episode-buttons">
      <button onclick="playEpisode('${m.link}')">Watch Now</button>
    </div>
    <button onclick="goBackToList('movies')"class="btn">Back</button>
  `;
  container.style.display = 'block'; // Ensure container is visible
  alert('movieDetails display set to block: ' + container.style.display); // DEBUG ALERT
  saveState('movies', 'movie', i); // Save active section, detail type, and index
  window.scrollTo(0, 0); // Scroll to top of details

  // HIDE navigation and search bar
  document.querySelector('nav').style.display = 'none';
  document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'none');
}

// Modified goBackToList to clear detail state
function goBackToList(type) {
  alert('goBackToList called for type: ' + type); // DEBUG ALERT
  if (type === 'series') {
    showSeriesList();
    document.getElementById('seriesDetails').style.display = 'none';
    saveState('series'); // Only save section, clear detail state
  } else {
    showMovieList();
    document.getElementById('movieDetails').style.display = 'none';
    saveState('movies'); // Only save section, clear detail state
  }
  window.scrollTo(0, 0); // Scroll to top of list

  // SHOW navigation and search bar
  document.querySelector('nav').style.display = 'flex'; // Revert to original display for nav
  document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'block'); // Revert to original display for search-box
}

// Original playEpisode and closeFullScreen remain the same
function playEpisode(link) {
  const player = document.getElementById('videoFullScreen');
  player.querySelector('iframe').src = link;
  player.style.display = 'flex';
}

function closeFullScreen() {
  const player = document.getElementById('videoFullScreen');
  player.querySelector('iframe').src = '';
  player.style.display = 'none';
  restoreScrollPosition();
}

// NEW/MODIFIED FUNCTION: Add to Watch Later
function addToWatchLater(itemIndex, itemType) {
    let watchLaterItems = JSON.parse(localStorage.getItem('watchLater')) || [];

    const itemContent = itemType === 'series' ? content.series : content.movies;
    const item = itemContent[itemIndex];

    if (!item) {
        alert(`Error: Item not found for type: ${itemType}, index: ${itemIndex}`); // DEBUG ALERT
        return;
    }

    const itemToAdd = {
        index: itemIndex,
        type: itemType,
        title: item.title,
        image: item.image
    };

    const isDuplicate = watchLaterItems.some(existingItem =>
        parseInt(existingItem.index, 10) === parseInt(itemToAdd.index, 10) && existingItem.type === itemToAdd.type
    );

    if (!isDuplicate) {
        watchLaterItems.push(itemToAdd);
        localStorage.setItem('watchLater', JSON.stringify(watchLaterItems));
        alert(`${itemToAdd.title} added to Watch Later!`);
        alert('Watch Later items after add (JSON): ' + JSON.stringify(watchLaterItems)); // DEBUG ALERT
    } else {
        alert(`${itemToAdd.title} is already in your Watch Later list.`);
    }
}

// NEW FUNCTION: Show Watch Later List
function showWatchLaterList() {
    alert('showWatchLaterList started.'); // DEBUG ALERT
    const container = document.getElementById('watchLaterList');
    const noItemsMessage = document.getElementById('noWatchLaterItems');
    container.innerHTML = ''; // Clear previous items
    alert('watchLaterList container cleared (innerHTML).'); // DEBUG ALERT

    let watchLaterItems = JSON.parse(localStorage.getItem('watchLater')) || [];
    alert('Watch Later items loaded from localStorage: ' + JSON.stringify(watchLaterItems)); // DEBUG ALERT

    if (watchLaterItems.length === 0) {
        alert('No Watch Later items, showing message.'); // DEBUG ALERT
        noItemsMessage.style.display = 'block'; // Show "No items" message
    } else {
        alert(`Found ${watchLaterItems.length} Watch Later items, hiding message and rendering.`); // DEBUG ALERT
        noItemsMessage.style.display = 'none'; // Hide "No items" message
        watchLaterItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'series-item';
            div.innerHTML = `
                <img src="${item.image}" alt="${item.title}" />
                <h4>${item.title}</h4>
                <button onclick="${item.type === 'series' ? `showSeriesDetails(${item.index})` : `showMovieDetails(${item.index})`}" class="btn">View</button>
                <button onclick="removeFromWatchLater(${item.index}, '${item.type}')" class="btn">Remove</button>
            `;
            container.appendChild(div);
            alert('Appended item: ' + item.title + ' (Type: ' + item.type + ', Index: ' + item.index + ')'); // DEBUG ALERT
        });
    }
    // Ensure nav and search are visible when in watchLater section
    document.querySelector('nav').style.display = 'flex';
    document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'block');
    alert('showWatchLaterList finished. List should be visible now.'); // DEBUG ALERT
}

// NEW FUNCTION: Remove from Watch Later (FIXED TYPE COERCION)
function removeFromWatchLater(itemIndex, itemType) {
    alert('removeFromWatchLater called for index: ' + itemIndex + ', type: ' + itemType); // DEBUG ALERT 1

    let watchLaterItems = JSON.parse(localStorage.getItem('watchLater')) || [];
    alert('BEFORE filter - Watch Later items: ' + JSON.stringify(watchLaterItems)); // DEBUG ALERT 2

    const initialLength = watchLaterItems.length;

    // IMPORTANT FIX: Ensure item.index is parsed as an integer for comparison
    watchLaterItems = watchLaterItems.filter(item => {
        const match = (parseInt(item.index, 10) === parseInt(itemIndex, 10) && item.type === itemType);
        // This alert will appear for EACH item in the list, so be prepared to tap OK multiple times
        alert('Filtering: item.index=' + item.index + ' (' + typeof item.index + '), item.type=' + item.type + ' (' + typeof item.type + ') vs targetIndex=' + itemIndex + ' (' + typeof itemIndex + '), targetType=' + itemType + ' (' + typeof itemType + '). Match: ' + match); // DEBUG ALERT 3
        return !match;
    });

    alert('AFTER filter - Watch Later items: ' + JSON.stringify(watchLaterItems)); // DEBUG ALERT 4

    if (watchLaterItems.length < initialLength) {
        localStorage.setItem('watchLater', JSON.stringify(watchLaterItems));
        alert('Item removed from Watch Later. localStorage updated.'); // DEBUG ALERT 5
        showWatchLaterList(); // Re-render the list after removal
    } else {
        alert('Warning: Attempted to remove item not found, or filter failed.'); // DEBUG ALERT 6
    }
}

// Initialize on DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    alert('DOMContentLoaded fired.'); // DEBUG ALERT
    const lastActiveSection = localStorage.getItem('lastActiveSection');
    const lastDetailType = localStorage.getItem('lastDetailType');
    const lastDetailIndex = localStorage.getItem('lastDetailIndex');
    alert('Last active state on load: ' + JSON.stringify({ lastActiveSection, lastDetailType, lastDetailIndex })); // DEBUG ALERT

    if (lastActiveSection) {
        showSeriesList();
        showMovieList();

        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(lastActiveSection).classList.add('active');

        if (lastDetailType && lastDetailIndex !== null) {
            alert('Restoring to detail view.'); // DEBUG ALERT
            if (lastDetailType === 'series') {
                showSeriesDetails(parseInt(lastDetailIndex, 10));
            } else if (lastDetailType === 'movie') {
                showMovieDetails(parseInt(lastDetailIndex, 10));
            }
            document.querySelector('nav').style.display = 'none';
            document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'none');
        } else {
            alert('Restoring to list view.'); // DEBUG ALERT
            if (lastActiveSection === 'series') {
                document.getElementById('seriesDetails').style.display = 'none';
            } else if (lastActiveSection === 'movies') {
                document.getElementById('movieDetails').style.display = 'none';
            } else if (lastActiveSection === 'watchLater') {
                alert('Restoring to Watch Later section.'); // DEBUG ALERT
                showWatchLaterList();
            }
            document.querySelector('nav').style.display = 'flex';
            document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'block');
        }
        restoreScrollPosition();
    } else {
        alert('No state remembered, defaulting to home.'); // DEBUG ALERT
        showSection('home');
        document.querySelector('nav').style.display = 'flex';
        document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'block');
    }

    // Add a global scroll listener to save position periodically
    let scrollTimer;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            saveScrollPosition();
        }, 200);
    });

    window.addEventListener('beforeunload', saveScrollPosition);
});
