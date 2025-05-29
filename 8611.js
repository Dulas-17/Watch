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
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  saveState(id); // Save the active section

  // Ensure nav is visible when switching sections normally
  document.querySelector('nav').style.display = 'flex'; // Assuming nav is flex or block

  // Clear and reset state for specific sections
  if (id === 'series') {
    showSeriesList(); // Re-render series list to ensure it's fresh
    document.getElementById('seriesDetails').style.display = 'none'; // Hide details if active
  } else if (id === 'movies') {
    showMovieList(); // Re-render movie list
    document.getElementById('movieDetails').style.display = 'none'; // Hide details if active
  } else if (id === 'searchSection') {
    // Clear previous search results and input when entering search section
    document.getElementById('universalSearchInput').value = '';
    document.getElementById('searchResultsSeries').innerHTML = '<p id="noSeriesResults" style="display: none;">No series found for your search.</p>';
    document.getElementById('noSeriesResults').style.display = 'none'; // Ensure message is hidden
    document.getElementById('searchResultsMovies').innerHTML = '<p id="noMoviesResults" style="display: none;">No movies found for your search.</p>';
    document.getElementById('noMoviesResults').style.display = 'none'; // Ensure message is hidden
  }

  window.scrollTo(0, 0); // Scroll to top of new section
}

// --- REMOVED OLD searchContent(type) function ---

// NEW: Universal search function
function searchUniversalContent() {
    const query = document.getElementById('universalSearchInput').value.toLowerCase();

    // Filter series
    const filteredSeries = content.series.filter(item => item.title.toLowerCase().includes(query));
    displaySearchResultsSeries(filteredSeries);

    // Filter movies
    const filteredMovies = content.movies.filter(item => item.title.toLowerCase().includes(query));
    displaySearchResultsMovies(filteredMovies);

    saveScrollPosition(); // Save scroll position after search
}

// Original showSeriesList (for main Series section)
function showSeriesList(list = content.series) {
  const container = document.getElementById('seriesList');
  container.innerHTML = '';
  list.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'series-item';
    div.innerHTML = `
      <img src="${s.image}" alt="${s.title}" />
      <h4>${s.title}</h4>
      <button onclick="showSeriesDetails(${i})"class="btn">Open</button>
    `;
    container.appendChild(div);
  });
  if (list === content.series && localStorage.getItem('lastActiveSection') === 'series' && !localStorage.getItem('lastDetailType')) {
      restoreScrollPosition();
  }
}

// Original showMovieList (for main Movies section)
function showMovieList(list = content.movies) {
  const container = document.getElementById('movieList');
  container.innerHTML = '';
  list.forEach((m, i) => {
    const div = document.createElement('div');
    div.className = 'series-item';
    div.innerHTML = `
      <img src="${m.image}" alt="${m.title}" />
      <h4>${m.title}</h4>
      <button onclick="showMovieDetails(${i})" class="btn">Watch </button>
    `;
    container.appendChild(div);
  });
  if (list === content.movies && localStorage.getItem('lastActiveSection') === 'movies' && !localStorage.getItem('lastDetailType')) {
      restoreScrollPosition();
  }
}

// NEW: Display Series Search Results
function displaySearchResultsSeries(list) {
    const container = document.getElementById('searchResultsSeries');
    const noResultsMessage = document.getElementById('noSeriesResults');
    container.innerHTML = ''; // Clear previous results

    if (list.length === 0) {
        noResultsMessage.style.display = 'block'; // Show "No results" message
        container.appendChild(noResultsMessage); // Ensure it's inside the container
    } else {
        noResultsMessage.style.display = 'none'; // Hide "No results" message
        list.forEach((s, i) => {
            // Find the original index of the series in content.series
            // This is crucial for showSeriesDetails to work correctly
            const originalIndex = content.series.findIndex(item => item.title === s.title && item.description === s.description);
            if (originalIndex === -1) return; // Should not happen if filtered from content.series

            const div = document.createElement('div');
            div.className = 'series-item'; // Use existing styling
            div.innerHTML = `
                <img src="${s.image}" alt="${s.title}" />
                <h4>${s.title}</h4>
                <button onclick="showSeriesDetails(${originalIndex})" class="btn">View</button>
            `;
            container.appendChild(div);
        });
    }
}

// NEW: Display Movie Search Results
function displaySearchResultsMovies(list) {
    const container = document.getElementById('searchResultsMovies');
    const noResultsMessage = document.getElementById('noMoviesResults');
    container.innerHTML = ''; // Clear previous results

    if (list.length === 0) {
        noResultsMessage.style.display = 'block'; // Show "No results" message
        container.appendChild(noResultsMessage); // Ensure it's inside the container
    } else {
        noResultsMessage.style.display = 'none'; // Hide "No results" message
        list.forEach((m, i) => {
            // Find the original index of the movie in content.movies
            const originalIndex = content.movies.findIndex(item => item.title === m.title && item.description === m.description);
            if (originalIndex === -1) return; // Should not happen if filtered from content.movies

            const div = document.createElement('div');
            div.className = 'series-item'; // Use existing styling
            div.innerHTML = `
                <img src="${m.image}" alt="${m.title}" />
                <h4>${m.title}</h4>
                <button onclick="showMovieDetails(${originalIndex})" class="btn">Watch</button>
            `;
            container.appendChild(div);
        });
    }
}

// Modified showSeriesDetails to save the series index
function showSeriesDetails(i) {
  const s = content.series[i];
  const container = document.getElementById('seriesDetails');
  document.getElementById('seriesList').innerHTML = ''; // Clear list when showing details
  // If coming from search section, clear search results too
  document.getElementById('searchResultsSeries').innerHTML = '';
  document.getElementById('searchResultsMovies').innerHTML = '';


  container.innerHTML = `
    <img src="${s.image}" alt="${s.title}" />
    <h2>${s.title}</h2>
    <p>${s.description}</p>
    <div class="episode-buttons">
      ${s.episodes.map(ep => `<button onclick="playEpisode('${ep.link}')">${ep.title}</button>`).join('')}
    </div>
    <button onclick="goBackToList('series')"class="back">Back</button>
  `;
  container.style.display = 'block';
  saveState('series', 'series', i); // Save active section, detail type, and index
  window.scrollTo(0, 0); // Scroll to top of details

  // HIDE navigation
  document.querySelector('nav').style.display = 'none';
  // Note: search-box elements are no longer individual, their parent section's display handles them.
  // We explicitly hide the universal search input's parent container if it was active
  document.querySelector('.search-box-universal').style.display = 'none';
}

// Modified showMovieDetails to save the movie index
function showMovieDetails(i) {
  const m = content.movies[i];
  const container = document.getElementById('movieDetails');
  document.getElementById('movieList').innerHTML = ''; // Clear list when showing details
  // If coming from search section, clear search results too
  document.getElementById('searchResultsSeries').innerHTML = '';
  document.getElementById('searchResultsMovies').innerHTML = '';

  container.innerHTML = `
    <img src="${m.image}" alt="${m.title}" />
    <h2>${m.title}</h2>
    <p>${m.description}</p>
    <div class="episode-buttons">
      <button onclick="playEpisode('${m.link}')">Watch Now</button>
    </div>
    <button onclick="goBackToList('movies')"class="back">Back</button>
  `;
  container.style.display = 'block';
  saveState('movies', 'movie', i); // Save active section, detail type, and index
  window.scrollTo(0, 0); // Scroll to top of details

  // HIDE navigation
  document.querySelector('nav').style.display = 'none';
  // Hide universal search input's parent container if it was active
  document.querySelector('.search-box-universal').style.display = 'none';
}

// Modified goBackToList to clear detail state
function goBackToList(type) {
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

  // SHOW navigation
  document.querySelector('nav').style.display = 'flex';
  // Show universal search input's parent container if the search section is now active
  // This might be tricky if the user wants to go back to search after viewing a detail from search.
  // For now, let's assume going back means showing the main section nav.
  // The universal search input's visibility is managed by its parent section's display property.
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

// Initialize on DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    const lastActiveSection = localStorage.getItem('lastActiveSection');
    const lastDetailType = localStorage.getItem('lastDetailType');
    const lastDetailIndex = localStorage.getItem('lastDetailIndex');

    if (lastActiveSection) {
        // Ensure all lists are potentially loaded first
        showSeriesList();
        showMovieList();

        // Then, activate the remembered section
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(lastActiveSection).classList.add('active');

        if (lastDetailType && lastDetailIndex !== null) {
            // If a specific detail was being viewed, show it
            if (lastDetailType === 'series') {
                showSeriesDetails(parseInt(lastDetailIndex, 10));
            } else if (lastDetailType === 'movie') {
                showMovieDetails(parseInt(lastDetailIndex, 10));
            }
            document.querySelector('nav').style.display = 'none'; // Hide nav
        } else {
            // If only a section was remembered (not a specific detail view)
            if (lastActiveSection === 'series') {
                document.getElementById('seriesDetails').style.display = 'none';
            } else if (lastActiveSection === 'movies') {
                document.getElementById('movieDetails').style.display = 'none';
            }
            document.querySelector('nav').style.display = 'flex'; // Show nav
        }
        restoreScrollPosition();
    } else {
        // If no state is remembered, default to 'home'
        showSection('home'); // This will also show nav
        showSeriesList(); // Ensure lists are populated
        showMovieList();
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
