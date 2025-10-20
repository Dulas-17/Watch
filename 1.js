// app.js - Complete, Unified JavaScript File

// ----------------------------------------------------
// I. Data Placeholders & Home Content (Previously 2.js, 3.js, home-data.js)
// ----------------------------------------------------

// NOTE: You must replace these empty arrays with your actual series and movie objects.
// Each item should have at least: 'title', 'image', 'genres', and 'id' (optional, but good for linking).
// Series also need an 'episodes' array.
const seriesData = [
    // EXAMPLE SERIES (REPLACE ME)
    { id: "s001", title: "The Coder's Quest", image: "https://placehold.co/200x300/1e293b/f0f9ff?text=Coder", genres: ["Sci-Fi", "Drama"], description: "A thrilling story of a developer fighting bugs.", episodes: [{title: "E01 - The Setup", link: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"}] },
    { id: "s002", title: "Bay Watch Classics", image: "https://placehold.co/200x300/10b981/f0f9ff?text=Bay+Watch", genres: ["Action", "Nostalgia"], description: "Lifeguards saving the day.", episodes: [{title: "E01 - Pilot", link: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"}] },
    { id: "s003", title: "Gemini Strikes", image: "https://placehold.co/200x300/6366f1/f0f9ff?text=Gemini", genres: ["Adventure", "Fantasy"], description: "The epic saga of an AI that gains sentience.", episodes: [{title: "S01E01", link: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"}] },
]; 
const movieData = [
    // EXAMPLE MOVIES (REPLACE ME)
    { id: "m001", title: "The Backend Breach", image: "https://placehold.co/200x300/f59e0b/1f2937?text=Breach", genres: ["Thriller", "Tech"], description: "A movie about a massive security flaw.", link: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" },
    { id: "m002", title: "Midnight Algorithm", image: "https://placehold.co/200x300/ef4444/f9fafb?text=Midnight", genres: ["Horror", "Mystery"], description: "A strange new algorithm drives people mad.", link: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" },
]; 

// Manual Home Content
const upcomingReleases = [
    {
        title: "The Next Generation",
        image: "https://placehold.co/200x300/a855f7/f3f4f6?text=Next+Gen",
        genre: "Sci-Fi",
        releaseDate: "Coming February 2026",
    },
    {
        title: "Echoes of the Past",
        image: "https://placehold.co/200x300/ec4899/f3f4f6?text=Echoes",
        genre: "Historical Drama",
        releaseDate: "Coming March 2026",
    },
];

const siteInfoBlock = {
    title: "Welcome to BayWatch!",
    message: "We highly advise you to download Google Drive, which will make your watching experience better and allow you to watch movies or shows in their highest quality. When you watch content, press the black box on the top right to enable all features. Thank you!",
};


// ----------------------------------------------------
// II. Global Variables & Setup
// ----------------------------------------------------
const content = {
  series: seriesData,
  movies: movieData,
};

// Global variables for scroll, video, and state management
let searchDebounceTimeout;
let suggestionDebounceTimeout;
let currentPlayingType = null;
let currentPlayingIndex = null;
let scrollPosition = {}; // Not strictly needed if using localStorage directly, but good for tracking

// Sound setup (assuming 'click2.mp3' is in the root directory)
const buttonSound = new Audio('click2.mp3'); 

document.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    try {
      buttonSound.currentTime = 0;
      buttonSound.play();
    } catch (err) {
      console.error('Failed to play button sound:', err);
    }
  }
});


// ----------------------------------------------------
// III. Sticky Genre Button Logic (Your Existing Logic)
// ----------------------------------------------------

// NOTE: This logic assumes a header exists and the genre buttons are NOT sticky by default.
const genreButtons = document.querySelector('.genre-buttons');
const header = document.querySelector('header'); // Assuming a header element exists
let lastScroll = window.pageYOffset;

// Wait for DOMContentLoaded to get accurate offset
let originalOffset = 0; 

window.addEventListener('scroll', () => {
    // Check if the current active section has a genre-buttons container visible
    const activeGenreContainer = document.querySelector('.section.active .genre-buttons');
    if (!activeGenreContainer || activeGenreContainer.style.display === 'none') {
        return; // Don't run sticky logic if not viewing a list page
    }

    // Re-calculate offset if it's 0 (only needed once after initial render)
    if (originalOffset === 0 && activeGenreContainer) {
        originalOffset = activeGenreContainer.offsetTop;
    }

    const currentScroll = window.pageYOffset;

    // Simplified sticky logic
    if (currentScroll > originalOffset) {
        // Scrolling past the original position
        activeGenreContainer.style.position = 'fixed';
        activeGenreContainer.style.top = (header ? header.offsetHeight : 0) + 'px';
        activeGenreContainer.style.left = '0';
        activeGenreContainer.style.right = '0';
        activeGenreContainer.style.width = '100%';
        activeGenreContainer.style.zIndex = '999';
        activeGenreContainer.style.paddingLeft = '1rem'; // Maintain padding when fixed
    } else {
        // Before or at the original position
        activeGenreContainer.style.position = 'relative';
        activeGenreContainer.style.top = '0';
        activeGenreContainer.style.left = '0';
        activeGenreContainer.style.right = '0';
        activeGenreContainer.style.width = 'auto';
        activeGenreContainer.style.paddingLeft = '0';
    }

    lastScroll = currentScroll;
});

// ----------------------------------------------------
// IV. Scroll & State Management (UPDATED for Scroll Fix)
// ----------------------------------------------------

/**
 * Saves the current scroll position of the window (or a specific container)
 * for the given section ID.
 */
function saveScrollPosition(sectionId) {
  if (!sectionId) return;
  
  // For the whole document, use window.scrollY
  localStorage.setItem(`scrollPosition_${sectionId}`, window.scrollY);
  console.log(`Saved scroll for ${sectionId}: ${window.scrollY}`);
}

/**
 * Restores the scroll position for the given section ID.
 */
function restoreScrollPosition(sectionId) {
  const storedScrollY = localStorage.getItem(`scrollPosition_${sectionId}`);
  if (storedScrollY) {
    const scrollValue = parseInt(storedScrollY, 10);
    // Use window.scrollTo for smooth restoration
    window.scrollTo({
        top: scrollValue,
        behavior: 'smooth'
    });
    console.log(`Restored scroll for ${sectionId}: ${storedScrollY}`);
  } else {
    // Ensure we scroll to top if no position is saved
    window.scrollTo(0, 0);
  }
}

function saveState(sectionId, detailType = null, detailIndex = null, originSection = null) {
  console.log(`saveState called: sectionId=${sectionId}, detailType=${detailType}, detailIndex=${detailIndex}, originSection=${originSection}`);
  localStorage.setItem('lastActiveSection', sectionId);

  if (detailType !== null && detailIndex !== null) {
    localStorage.setItem('lastDetailType', detailType);
    localStorage.setItem('lastDetailIndex', detailIndex);
  } else {
    localStorage.removeItem('lastDetailType');
    localStorage.removeItem('lastDetailIndex');
  }

  localStorage.removeItem('activeGenre');

  if (originSection !== null) {
    localStorage.setItem('originSection', originSection);
  } else {
    localStorage.removeItem('originSection');
  }
}

function saveAsWatched(type, index) {
  const key = `watched_${type}_${index}`;
  localStorage.setItem(key, 'true');
}

function isWatched(type, index) {
  const key = `watched_${type}_${index}`;
  return localStorage.getItem(key) === 'true';
}


// ----------------------------------------------------
// V. Video Playback & Tracking
// ----------------------------------------------------

function playEpisode(link, episodeTitle = null, type, index) {
  const player = document.getElementById('videoFullScreen');
  const iframe = player.querySelector('iframe');

  // Save the scroll position of the current background section before opening video
  const currentActiveSection = document.querySelector('.section.active');
  if (currentActiveSection) {
      saveScrollPosition(currentActiveSection.id);
  }

  currentPlayingType = type;
  currentPlayingIndex = index;

  iframe.src = link;
  player.style.display = 'flex';
}

function closeFullScreen() {
  const player = document.getElementById('videoFullScreen');
  const iframe = player.querySelector('iframe');

  if (currentPlayingType !== null && currentPlayingIndex !== null) {
      saveAsWatched(currentPlayingType, currentPlayingIndex);
  }

  iframe.src = '';
  player.style.display = 'none';
  
  // Restore scroll position after closing video
  restoreScrollPosition(localStorage.getItem('lastActiveSection'));

  currentPlayingType = null;
  currentPlayingIndex = null;
}


// ----------------------------------------------------
// VI. Home Section Rendering Logic (NEW)
// ----------------------------------------------------

function createStripHeader(title) {
    return `
        <h2 style="margin-top: 2.5rem; margin-bottom: 0.5rem; color: var(--primary-blue);">${title}</h2>
        <div class="home-strip-container">
    `;
}

// Reuses the card structure for visual consistency
function createHomeContentCard(item, type, originalIndex) {
    const detailFunctionCall = `saveScrollAndShowDetails('${type}', ${originalIndex})`;
    
    return `
        <div class="series-item" style="flex: 0 0 auto; width: 130px;">
            <img src="${item.image}" alt="${item.title}" />
            <h4 style="font-size: 0.8rem; margin: 0.5rem 0 0.2rem;">${item.title}</h4>
            <button onclick="${detailFunctionCall}" class="btn" style="padding: 0.4rem; font-size: 0.7rem; margin-top: 0.4rem;">Open</button>
        </div>
    `;
}

function createUpcomingCardHTML(item) {
    return `
        <div class="series-item" style="flex: 0 0 auto; width: 130px; border: 1px solid #ffc107; cursor: default;">
            <img src="${item.image}" alt="${item.title}" />
            <h4 style="font-size: 0.8rem; margin: 0.5rem 0 0.2rem;">${item.title}</h4>
            <p style="font-size: 0.7rem; color: #e0a800; font-weight: bold; margin: 0.2rem 0;">${item.releaseDate}</p>
        </div>
    `;
}

function renderHomeSection() {
    const container = document.getElementById('homeContentStrips');
    if (!container) return;
    
    // Combine all content and add type/index for detail linking
    // We must use the original index within the respective movie/series array
    const allContent = [
        ...content.series.map((s, i) => ({ ...s, originalIndex: i, type: 'series' })),
        ...content.movies.map((m, i) => ({ ...m, originalIndex: i, type: 'movie' }))
    ];

    let html = '';
    
    // --- 1. Site Info/Welcome Block ---
    html += `
        <div class="home-info-block">
            <h1>${siteInfoBlock.title}</h1>
            <p>${siteInfoBlock.message}</p>
        </div>
    `;

    // --- 2. Trending Now (First 10 items) ---
    const trendingContent = allContent.slice(0, 10);
    
    html += createStripHeader("🔥 Trending Now");
    trendingContent.forEach(item => {
        html += createHomeContentCard(item, item.type, item.originalIndex);
    });
    html += `</div>`;

    // --- 3. Discovery Picks (Random Mix) ---
    const discoveryContent = [...allContent]
        .sort(() => 0.5 - Math.random()) 
        .slice(0, 15); 

    html += createStripHeader("✨ Discovery Picks");
    discoveryContent.forEach(item => {
        html += createHomeContentCard(item, item.type, item.originalIndex);
    });
    html += `</div>`;

    // --- 4. Upcoming Releases (Manual Data) ---
    if (upcomingReleases.length > 0) {
        html += createStripHeader("🗓️ Upcoming Releases");
        upcomingReleases.forEach(item => {
            html += createUpcomingCardHTML(item);
        });
        html += `</div>`;
    }

    container.innerHTML = html;
}


// ----------------------------------------------------
// VII. Section Management (UPDATED for Scroll Fix)
// ----------------------------------------------------

function showSection(id) {
  const currentActiveSection = document.querySelector('.section.active');
  if (currentActiveSection && currentActiveSection.id) {
      // 1. SAVE SCROLL of the section we are leaving
      saveScrollPosition(currentActiveSection.id);
  }
  
  console.log(`showSection called for: ${id}`);
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  saveState(id);

  document.getElementById('seriesDetails').style.display = 'none';
  document.getElementById('movieDetails').style.display = 'none';
  document.querySelector('nav').style.display = 'flex';

  document.querySelectorAll('.search-container').forEach(sc => sc.style.display = 'none');
  document.querySelectorAll('.genre-buttons').forEach(gb => gb.style.display = 'none');
  
  if (id === 'home') {
    renderHomeSection(); // Render the dynamic content
  } else if (id === 'series') {
    document.querySelector('#series .search-container').style.display = 'block';
    document.getElementById('seriesGenreButtons').style.display = 'flex';
    const savedQuery = localStorage.getItem('searchQuery_series') || '';
    document.getElementById('seriesSearch').value = savedQuery;
    renderGenreButtons('series');
    if (savedQuery) {
      performSearch('series');
    } else {
      const activeGenreSeries = localStorage.getItem('activeGenre_series') || 'All';
      filterContentByGenre('series', activeGenreSeries);
    }
  } else if (id === 'movies') {
    document.querySelector('#movies .search-container').style.display = 'block';
    document.getElementById('movieGenreButtons').style.display = 'flex';
    const savedQuery = localStorage.getItem('searchQuery_movies') || '';
    document.getElementById('movieSearch').value = savedQuery;
    renderGenreButtons('movies');
    if (savedQuery) {
      performSearch('movies');
    } else {
      const activeGenreMovies = localStorage.getItem('activeGenre_movies') || 'All';
      filterContentByGenre('movies', activeGenreMovies);
    }
  } else if (id === 'watchLater') {
    showWatchLater();
  }
  
  // 2. RESTORE SCROLL for the section we just entered
  restoreScrollPosition(id);
}


// ----------------------------------------------------
// VIII. Search & Filter Functionality
// ----------------------------------------------------

function performSearch(type) {
  const inputElement = document.getElementById(type === 'series' ? 'seriesSearch' : 'movieSearch');
  const query = inputElement.value.toLowerCase().trim();

  hideSuggestions(type);

  if (query) {
    localStorage.setItem(`searchQuery_${type}`, query);
  } else {
    localStorage.removeItem(`searchQuery_${type}`);
  }

  const filtered = content[type].filter(item => {
    if (item.title.toLowerCase().includes(query)) return true;
    if (item.description && item.description.toLowerCase().includes(query)) return true;
    if (item.genres && item.genres.some(genre => genre.toLowerCase().includes(query))) return true;
    return false;
  });

  localStorage.setItem(`activeGenre_${type}`, 'All');
  renderGenreButtons(type);

  if (type === 'series') {
    showSeriesList(filtered, query);
  } else {
    showMovieList(filtered, query);
  }
}

function searchContent(type) {
  clearTimeout(searchDebounceTimeout);
  clearTimeout(suggestionDebounceTimeout);
  performSearch(type);
}

function handleSearchInputForSuggestions(type) {
  const inputElement = document.getElementById(type === 'series' ? 'seriesSearch' : 'movieSearch');
  const query = inputElement.value.toLowerCase().trim();

  clearTimeout(suggestionDebounceTimeout);
  if (query.length > 0) {
    suggestionDebounceTimeout = setTimeout(() => {
      showSuggestions(type, query);
    }, 100);
  } else {
    hideSuggestions(type);
  }
}

function showSuggestions(type, query) {
  const suggestionsContainer = document.getElementById(type === 'series' ? 'seriesSuggestions' : 'movieSuggestions');
  suggestionsContainer.innerHTML = '';

  if (query.length === 0) {
    hideSuggestions(type);
    return;
  }

  const relevantContent = content[type];
  const matchingSuggestions = relevantContent.filter(item =>
    item.title.toLowerCase().includes(query)
  ).slice(0, 5);

  if (matchingSuggestions.length > 0) {
    matchingSuggestions.forEach(item => {
      const suggestionItem = document.createElement('div');
      suggestionItem.className = 'suggestion-item';
      const highlightedText = item.title.replace(new RegExp(query, 'gi'), match => `<span style="background-color: #5a9bd8; color: #121212; border-radius: 3px; padding: 0 2px;">${match}</span>`);
      suggestionItem.innerHTML = highlightedText;
      suggestionItem.onclick = () => selectSuggestion(type, item.title);
      suggestionsContainer.appendChild(suggestionItem);
    });
    suggestionsContainer.classList.add('active');
  } else {
    hideSuggestions(type);
  }
}

function selectSuggestion(type, title) {
  const inputElement = document.getElementById(type === 'series' ? 'seriesSearch' : 'movieSearch');
  inputElement.value = title;
  hideSuggestions(type);
  performSearch(type);
}

function hideSuggestions(type) {
  const suggestionsContainer = document.getElementById(type === 'series' ? 'seriesSuggestions' : 'movieSuggestions');
  suggestionsContainer.classList.remove('active');
}

function getUniqueGenres(type) {
  const allGenres = content[type].flatMap(item => item.genres || []);
  return ['All', ...new Set(allGenres)].sort();
}

function renderGenreButtons(type) {
  const containerId = type === 'series' ? 'seriesGenreButtons' : 'movieGenreButtons';
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  const genres = getUniqueGenres(type);
  const activeGenre = localStorage.getItem(`activeGenre_${type}`) || 'All';

  genres.forEach(genre => {
    const button = document.createElement('button');
    button.textContent = genre;
    button.onclick = () => filterContentByGenre(type, genre);
    if (genre === activeGenre) {
      button.classList.add('active-genre');
    }
    container.appendChild(button);
  });
}

function filterContentByGenre(type, genre) {
  const genreButtonsContainerId = type === 'series' ? 'seriesGenreButtons' : 'movieGenreButtons';
  const buttons = document.getElementById(genreButtonsContainerId).querySelectorAll('button');

  buttons.forEach(button => {
    button.classList.toggle('active-genre', button.textContent === genre);
  });

  let filteredList;
  if (genre === 'All') {
    filteredList = content[type];
  } else {
    filteredList = content[type].filter(item => item.genres && item.genres.includes(genre));
  }

  if (type === 'series') {
    document.getElementById('seriesSearch').value = '';
    hideSuggestions('series');
    localStorage.removeItem('searchQuery_series');
    showSeriesList(filteredList);
  } else if (type === 'movies') {
    document.getElementById('movieSearch').value = '';
    hideSuggestions('movies');
    localStorage.removeItem('searchQuery_movies');
    showMovieList(filteredList);
  }

  localStorage.setItem(`activeGenre_${type}`, genre);
}


// ----------------------------------------------------
// IX. Display List Functions
// ----------------------------------------------------

function showSeriesList(list = null, query = '') {
  const currentList = list || content.series;
  const container = document.getElementById('seriesList');
  container.innerHTML = '';

  const activeGenre = localStorage.getItem('activeGenre_series');

  const displayList = (list === null && activeGenre && activeGenre !== 'All') ?
    currentList.filter(s => s.genres && s.genres.includes(activeGenre)) :
    currentList;

  if (displayList.length === 0) {
    const message = (query !== '') ? `No results found for "${query}".` : `No items to display here.`;
    container.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem;">${message}</p>`;
    return;
  }

  displayList.forEach((s) => {
    const div = document.createElement('div');
    div.className = 'series-item';
    // Find the current index to ensure detail link works correctly
    const originalIndex = content.series.findIndex(item => item.id === s.id);
    if (originalIndex === -1) return;

    const highlightedTitle = query ? s.title.replace(new RegExp(query, 'gi'), match => `<span style="background-color: #5a9bd8; color: #121212; border-radius: 3px; padding: 0 2px;">${match}</span>`) : s.title;

    div.innerHTML = `
          <img src="${s.image}" alt="${s.title}" />
          <h4>${highlightedTitle}</h4>
          <button onclick="saveScrollAndShowDetails('series', ${originalIndex})" class="btn">Open</button>
          <button onclick="addToWatchLater('series', ${originalIndex})" class="watch-later-btn">Watch Later</button>
        `;
    container.appendChild(div);
  });
}

function showMovieList(list = null, query = '') {
  const currentList = list || content.movies;
  const container = document.getElementById('movieList');
  container.innerHTML = '';

  const activeGenre = localStorage.getItem('activeGenre_movies');

  const displayList = (list === null && activeGenre && activeGenre !== 'All') ?
    currentList.filter(m => m.genres && m.genres.includes(activeGenre)) :
    currentList;

  if (displayList.length === 0) {
    const message = (query !== '') ? `No results found for "${query}".` : `No items to display here.`;
    container.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem;">${message}</p>`;
    return;
  }

  displayList.forEach((m) => {
    const div = document.createElement('div');
    div.className = 'series-item';
    const originalIndex = content.movies.findIndex(item => item.id === m.id);
    if (originalIndex === -1) return;

    const highlightedTitle = query ? m.title.replace(new RegExp(query, 'gi'), match => `<span style="background-color: #5a9bd8; color: #121212; border-radius: 3px; padding: 0 2px;">${match}</span>`) : m.title;

    div.innerHTML = `
          <img src="${m.image}" alt="${m.title}" />
          <h4>${highlightedTitle}</h4>
          <button onclick="saveScrollAndShowDetails('movie', ${originalIndex})" class="btn">Open</button>
          <button onclick="addToWatchLater('movie', ${originalIndex})" class="watch-later-btn">Watch Later</button>
        `;
    container.appendChild(div);
  });
}


// ----------------------------------------------------
// X. Detail View & Navigation
// ----------------------------------------------------

// NEW: Helper function to save scroll position before showing details
function saveScrollAndShowDetails(type, index) {
  const sectionId = type === 'series' ? 'series' : 'movies';
  saveScrollPosition(sectionId);

  if (type === 'series') {
    showSeriesDetails(index);
  } else {
    showMovieDetails(index);
  }
}

function showSeriesDetails(i, originSection = null) {
  const s = content.series[i];
  if (!s) {
    console.error("Error: Series item not found at index:", i);
    // Use custom modal or message box instead of alert()
    // alert("Could not load series details. Data might be missing or corrupted."); 
    showSection(originSection === 'watchLater' ? 'watchLater' : 'series');
    return;
  }
  const container = document.getElementById('seriesDetails');

  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById('series').classList.add('active');

  document.getElementById('seriesList').innerHTML = '';
  document.getElementById('seriesDetails').style.display = 'block';

  document.querySelector('nav').style.display = 'none';
  document.querySelectorAll('.search-container').forEach(sc => sc.style.display = 'none');
  document.querySelectorAll('.genre-buttons').forEach(gb => gb.style.display = 'none');

  container.innerHTML = `
        <img src="${s.image}" alt="${s.title}" />
        <h2>${s.title}</h2>
        <p>${s.description}</p>
        <div class="episode-buttons">
          ${s.episodes.map((ep, epIndex) => {
    const isEpisodeWatched = isWatched('series', `${i}_${epIndex}`);
    const buttonClass = isEpisodeWatched ? 'watched-episode-btn' : '';
    // Escape single quotes in episode title for safe use in onclick
    const safeTitle = ep.title.replace(/'/g, "\\'"); 
    return `<button onclick="playEpisode('${ep.link}', '${safeTitle}', 'series', '${i}_${epIndex}')" class="${buttonClass}">${ep.title}</button>`;
  }).join('')}
        </div>
        <div class="detail-bottom-actions">
            <button onclick="shareContent('series', ${i})" class="back">Share</button>
            <button onclick="goBackToList('series')" class="back">Back</button>
            <button onclick="copyLinkToClipboard('series', ${i})" class="back">Link</button> 
        </div>
      `;

  saveState('series', 'series', i, originSection);
  window.scrollTo(0, 0);
}

function showMovieDetails(i, originSection = null) {
  const m = content.movies[i];
  if (!m) {
    console.error("Error: Movie item not found at index:", i);
    showSection(originSection === 'watchLater' ? 'watchLater' : 'movies');
    return;
  }
  const container = document.getElementById('movieDetails');

  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById('movies').classList.add('active');

  document.getElementById('movieList').innerHTML = '';
  document.getElementById('movieDetails').style.display = 'block';

  document.querySelector('nav').style.display = 'none';
  document.querySelectorAll('.search-container').forEach(sc => sc.style.display = 'none');
  document.querySelectorAll('.genre-buttons').forEach(gb => gb.style.display = 'none');

  const isMovieWatched = isWatched('movie', i);
  const buttonClass = isMovieWatched ? 'watched-episode-btn' : '';

  // Escape single quotes in movie title for safe use in onclick
  const safeTitle = m.title.replace(/'/g, "\\'"); 

  container.innerHTML = `
        <img src="${m.image}" alt="${m.title}" />
        <h2>${m.title}</h2>
        <p>${m.description}</p>
        <div class="episode-buttons">
          <button onclick="playEpisode('${m.link}', '${safeTitle}', 'movie', ${i})" class="${buttonClass}">Watch Now</button>
        </div>
        <div class="detail-bottom-actions">
            <button onclick="shareContent('movie', ${i})" class="back">Share</button>
            <button onclick="goBackToList('movies')" class="back">Back</button>
            <button onclick="copyLinkToClipboard('movie', ${i})" class="back">Link</button> 
        </div>
      `;
  saveState('movies', 'movie', i, originSection);
  window.scrollTo(0, 0);
}

function goBackToList(type) {
  if (type === 'series') {
    document.getElementById('seriesDetails').style.display = 'none';
  } else {
    document.getElementById('movieDetails').style.display = 'none';
  }

  const originSection = localStorage.getItem('originSection');
  let targetSectionId = originSection === 'watchLater' ? 'watchLater' : type;

  // showSection handles the content list rendering and scroll restoration
  showSection(targetSectionId);
}

// ----------------------------------------------------
// XI. Watch Later Functionality
// ----------------------------------------------------

function getWatchLaterList() {
  const watchLaterJson = localStorage.getItem('watchLater');
  return watchLaterJson ? JSON.parse(watchLaterJson) : [];
}

function saveWatchLaterList(list) {
  localStorage.setItem('watchLater', JSON.stringify(list));
}

function addToWatchLater(type, index) {
  const item = type === 'series' ? content.series[index] : content.movies[index];
  const watchLaterList = getWatchLaterList();
  const itemId = `${type}-${item.id}`; // Use the item ID for reliable uniqueness

  const isAlreadyAdded = watchLaterList.some(
    (wlItem) => wlItem.uniqueId === itemId
  );

  if (!isAlreadyAdded) {
    // Store necessary data: unique ID, type, and the original index in the main list
    watchLaterList.push({ uniqueId: itemId, type: type, originalIndex: index, itemData: item });
    saveWatchLaterList(watchLaterList);
    console.log(`${item.title} added to Watch Later!`);
  } else {
    console.log(`${item.title} is already in your Watch Later list.`);
  }
}

function removeFromWatchLater(type, originalIndex) {
  let watchLaterList = getWatchLaterList();
  const item = type === 'series' ? content.series[originalIndex] : content.movies[originalIndex];
  if (!item) return;

  const initialLength = watchLaterList.length;
  const itemIdToRemove = `${type}-${item.id}`;

  watchLaterList = watchLaterList.filter(
    (wlItem) => wlItem.uniqueId !== itemIdToRemove
  );

  if (watchLaterList.length < initialLength) {
    saveWatchLaterList(watchLaterList);
    console.log('Item removed from Watch Later!');
    showWatchLater();
  }
}

function showWatchLater() {
  document.querySelectorAll('.search-container').forEach(sc => sc.style.display = 'none');
  document.querySelectorAll('.genre-buttons').forEach(gb => gb.style.display = 'none');
  document.querySelector('nav').style.display = 'flex';
  document.getElementById('seriesDetails').style.display = 'none';
  document.getElementById('movieDetails').style.display = 'none';

  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('watchLater').classList.add('active');

  const container = document.getElementById('watchLaterList');
  container.innerHTML = '';

  const watchLaterItems = getWatchLaterList();

  if (watchLaterItems.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #aaa;">Your Watch Later list is empty. Add some series or movies!</p>';
  } else {
    watchLaterItems.forEach((wlItem) => {
      const item = wlItem.itemData;
      const div = document.createElement('div');
      div.className = 'series-item';

      const detailFunctionCall = wlItem.type === 'series' ?
        `showSeriesDetails(${wlItem.originalIndex}, 'watchLater')` :
        `showMovieDetails(${wlItem.originalIndex}, 'watchLater')`;

      div.innerHTML = `
                <img src="${item.image}" alt="${item.title}" />
                <h4>${item.title}</h4>
                <button onclick="${detailFunctionCall}" class="btn">View Details</button>
                <button onclick="removeFromWatchLater('${wlItem.type}', ${wlItem.originalIndex})" class="remove-watch-later-btn">Remove</button>
            `;
      container.appendChild(div);
    });
  }
  saveState('watchLater');
  restoreScrollPosition('watchLater');
}


// ----------------------------------------------------
// XII. Share Functionality (Unchanged)
// ----------------------------------------------------
function generateShareLink(type, index) {
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?type=${type}&id=${index}`;
}

async function shareContent(type, index) {
  const item = type === 'series' ? content.series[index] : content.movies[index];
  if (!item) {
    console.error('Item not found for sharing:', type, index);
    return;
  }

  const shareUrl = generateShareLink(type, index);
  const shareData = {
    title: `Stream ${item.title} on BayWatch!`,
    text: item.description ? `"${item.description}"` : '',
    url: shareUrl,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareData.title + '\n' + shareData.text + '\n' + shareData.url)}`;
      window.open(whatsappUrl, '_blank');
    }
  } catch (error) {
    console.error('Error sharing content:', error);
  }
}

function copyLinkToClipboard(type, index) {
  const shareUrl = generateShareLink(type, index);
  // Using document.execCommand('copy') for better compatibility in limited environments
  const tempInput = document.createElement('input');
  tempInput.value = shareUrl;
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand('copy');
    console.log('Link copied:', shareUrl);
  } catch (err) {
    console.error('Failed to copy link:', err);
  }
  document.body.removeChild(tempInput);
}


// ----------------------------------------------------
// XIII. Initialization
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
  // Sort content alphabetically once on load
  content.series.sort((a, b) => a.title.localeCompare(b.title));
  content.movies.sort((a, b) => a.title.localeCompare(b.title));

  // --- URL Parameter Handling for Direct Links ---
  const urlParams = new URLSearchParams(window.location.search);
  const paramType = urlParams.get('type');
  const paramId = urlParams.get('id');

  if (paramType && paramId !== null) {
    const id = parseInt(paramId, 10);
    if (!isNaN(id)) {
      localStorage.clear(); // Clear local state for direct link entry
      if (paramType === 'series' && content.series[id]) {
        showSeriesDetails(id);
      } else if (paramType === 'movie' && content.movies[id]) {
        showMovieDetails(id);
      } else {
        showSection('home');
      }
    } else {
      showSection('home');
    }
  } else {
    // --- State Restoration (Scroll Fix applied via showSection) ---
    const lastActiveSection = localStorage.getItem('lastActiveSection');
    const lastDetailType = localStorage.getItem('lastDetailType');
    const lastDetailIndex = localStorage.getItem('lastDetailIndex');
    const originSection = localStorage.getItem('originSection');

    if (lastActiveSection) {
      if (lastDetailType && lastDetailIndex !== null) {
        if (lastDetailType === 'series') {
          showSeriesDetails(parseInt(lastDetailIndex, 10), originSection);
        } else if (lastDetailType === 'movie') {
          showMovieDetails(parseInt(lastDetailIndex, 10), originSection);
        }
      } else {
        // This calls showSection, which handles rendering and scroll restoration
        showSection(lastActiveSection); 
      }
    } else {
      // Default entry point
      showSection('home');
    }
  }

  // --- Input Event Listeners ---
  renderGenreButtons('series');
  renderGenreButtons('movies');

  const seriesSearchInput = document.getElementById('seriesSearch');
  if (seriesSearchInput) {
    seriesSearchInput.addEventListener('input', () => handleSearchInputForSuggestions('series'));
    seriesSearchInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); searchContent('series'); }
    });
    seriesSearchInput.addEventListener('blur', () => setTimeout(() => hideSuggestions('series'), 100));
    seriesSearchInput.addEventListener('focus', (event) => {
      const query = event.target.value.toLowerCase().trim();
      if (query.length > 0) { showSuggestions('series', query); }
    });
  }

  const movieSearchInput = document.getElementById('movieSearch');
  if (movieSearchInput) {
    movieSearchInput.addEventListener('input', () => handleSearchInputForSuggestions('movies'));
    movieSearchInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); searchContent('movies'); }
    });
    movieSearchInput.addEventListener('blur', () => setTimeout(() => hideSuggestions('movies'), 100));
    movieSearchInput.addEventListener('focus', (event) => {
      const query = event.target.value.toLowerCase().trim();
      if (query.length > 0) { showSuggestions('movies', query); }
    });
  }
});