// Function to write messages to the debug output div
function logDebugMessage(message) {
    const debugOutput = document.getElementById('debugOutput');
    if (debugOutput) {
        debugOutput.innerText += message + '\n';
        debugOutput.scrollTop = debugOutput.scrollHeight; // Scroll to bottom
    }
}

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
  logDebugMessage('showSection called with ID: ' + id);
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
    logDebugMessage('Calling showWatchLaterList from showSection...');
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
  logDebugMessage('showSeriesDetails called for index: ' + i);
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
  logDebugMessage('seriesDetails display set to block: ' + container.style.display);
  saveState('series', 'series', i); // Save active section, detail type, and index
  window.scrollTo(0, 0); // Scroll to top of details

  // HIDE navigation and search bar
  document.querySelector('nav').style.display = 'none';
  document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'none');
}

// Modified showMovieDetails to save the movie index
function showMovieDetails(i) {
  logDebugMessage('showMovieDetails called for index: ' + i);
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
  logDebugMessage('movieDetails display set to block: ' + container.style.display);
  saveState('movies', 'movie', i); // Save active section, detail type, and index
  window.scrollTo(0, 0); // Scroll to top of details

  // HIDE navigation and search bar
  document.querySelector('nav').style.display = 'none';
  document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'none');
}

// Modified goBackToList to clear detail state
function goBackToList(type) {
  logDebugMessage('goBackToList called for type: ' + type);
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
        logDebugMessage(`Error: Item not found for type: ${itemType}, index: ${itemIndex}`);
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
        logDebugMessage(`${itemToAdd.title} added to Watch Later!`);
    } else {
        logDebugMessage(`${itemToAdd.title} is already in your Watch Later list.`);
    }
}

// NEW FUNCTION: Show Watch Later List
function showWatchLaterList() {
    logDebugMessage('showWatchLaterList started.');
    const container = document.getElementById('watchLaterList');
    const noItemsMessage = document.getElementById('noWatchLaterItems');
    container.innerHTML = ''; // Clear previous items
    logDebugMessage('watchLaterList container cleared (innerHTML).');

    let watchLaterItems = JSON.parse(localStorage.getItem('watchLater')) || [];
    logDebugMessage('Watch Later items loaded from localStorage: ' + JSON.stringify(watchLaterItems)); // Keep this one, it's vital

    if (watchLaterItems.length === 0) {
        logDebugMessage('No Watch Later items, showing message.');
        noItemsMessage.style.display = 'block'; // Show "No items" message
    } else {
        logDebugMessage(`Found ${watchLaterItems.length} Watch Later items, hiding message and rendering.`);
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
            // Removed individual item append alerts
        });
    }
    // Ensure nav and search are visible when in watchLater section
    document.querySelector('nav').style.display = 'flex';
    document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'block');
    logDebugMessage('showWatchLaterList finished. List should be visible now.');
}

// NEW FUNCTION: Remove from Watch Later (FIXED TYPE COERCION)
function removeFromWatchLater(itemIndex, itemType) {
    logDebugMessage('removeFromWatchLater called for index: ' + itemIndex + ', type: ' + itemType);

    let watchLaterItems = JSON.parse(localStorage.getItem('watchLater')) || [];
    logDebugMessage('BEFORE filter - Watch Later items: ' + JSON.stringify(watchLaterItems)); // Keep this one, it's vital

    const initialLength = watchLaterItems.length;

    // IMPORTANT FIX: Ensure item.index is parsed as an integer for comparison
    watchLaterItems = watchLaterItems.filter(item => {
        const match = (parseInt(item.index, 10) === parseInt(itemIndex, 10) && item.type === itemType);
        // Removed per-item filter alerts
        return !match;
    });

    logDebugMessage('AFTER filter - Watch Later items: ' + JSON.stringify(watchLaterItems)); // Keep this one, it's vital

    if (watchLaterItems.length < initialLength) {
        localStorage.setItem('watchLater', JSON.stringify(watchLaterItems));
        logDebugMessage('Item removed from Watch Later. localStorage updated.');
        showWatchLaterList(); // Re-render the list after removal
    } else {
        logDebugMessage('Warning: Attempted to remove item not found, or filter failed.');
    }
}

// Initialize on DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    logDebugMessage('DOMContentLoaded fired.');
    const lastActiveSection = localStorage.getItem('lastActiveSection');
    const lastDetailType = localStorage.getItem('lastDetailType');
    const lastDetailIndex = localStorage.getItem('lastDetailIndex');
    logDebugMessage('Last active state on load: ' + JSON.stringify({ lastActiveSection, lastDetailType, lastDetailIndex }));

    if (lastActiveSection) {
        showSeriesList();
        showMovieList();

        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(lastActiveSection).classList.add('active');

        if (lastDetailType && lastDetailIndex !== null) {
            logDebugMessage('Restoring to detail view.');
            if (lastDetailType === 'series') {
                showSeriesDetails(parseInt(lastDetailIndex, 10));
            } else if (lastDetailType === 'movie') {
                showMovieDetails(parseInt(lastDetailIndex, 10));
            }
            document.querySelector('nav').style.display = 'none';
            document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'none');
        } else {
            logDebugMessage('Restoring to list view.');
            if (lastActiveSection === 'series') {
                document.getElementById('seriesDetails').style.display = 'none';
            } else if (lastActiveSection === 'movies') {
                document.getElementById('movieDetails').style.display = 'none';
            } else if (lastActiveSection === 'watchLater') {
                logDebugMessage('Restoring to Watch Later section.');
                showWatchLaterList();
            }
            document.querySelector('nav').style.display = 'flex';
            document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'block');
        }
        restoreScrollPosition();
    } else {
        logDebugMessage('No state remembered, defaulting to home.');
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
