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

      // Ensure nav and search are visible when switching sections normally
      document.querySelector('nav').style.display = 'flex'; // Assuming nav is flex or block
      document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'block'); // Assuming search-box is block

      if (id === 'series') {
        showSeriesList();
        document.getElementById('seriesDetails').style.display = 'none';
      } else if (id === 'movies') {
        showMovieList();
        document.getElementById('movieDetails').style.display = 'none';
      } else if (id === 'watchLater') { // ADDED: Call showWatchLaterList when 'watchLater' section is active
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
        // Changed to use an anonymous function to pass 'i' directly to avoid immediate execution issues with loops
        // --- CORRECTED: Watch Later button is now INSIDE the div ---
        div.innerHTML = `
          <img src="${s.image}" alt="${s.title}" />
          <h4>${s.title}</h4>
          <button onclick="showSeriesDetails(${i})" class="btn">Open</button>
          <button onclick="addToWatchLater(${i}, 'series')" class="btn">Watch Later</button>
        `;
        container.appendChild(div);
      });
      // Restore scroll only if this is the initial load for the main list
      // We don't want to restore if a search filters the list
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
        div.className = 'series-item'; // Keep class name for styling consistency
        // Changed to use an anonymous function to pass 'i' directly to avoid immediate execution issues with loops
        // --- CORRECTED: Watch Later button is now INSIDE the div ---
        div.innerHTML = `
          <img src="${m.image}" alt="${m.title}" />
          <h4>${m.title}</h4>
          <button onclick="showMovieDetails(${i})" class="btn">Watch</button>
          <button onclick="addToWatchLater(${i}, 'movie')" class="btn">Watch Later</button>
        `;
        container.appendChild(div);
      });
      // Restore scroll only if this is the initial load for the main list
      if (list === content.movies && localStorage.getItem('lastActiveSection') === 'movies' && !localStorage.getItem('lastDetailType')) {
          restoreScrollPosition();
      }
    }

    // Modified showSeriesDetails to save the series index
    function showSeriesDetails(i) {
      const s = content.series[i];
      const container = document.getElementById('seriesDetails');
      container.innerHTML = `
        <img src="${s.image}" alt="${s.title}" />
        <h2>${s.title}</h2>
        <p>${s.description}</p>
        <div class="episode-buttons">
          ${s.episodes.map(ep => `<button onclick="playEpisode('${ep.link}')">${ep.title}</button>`).join('')}
        </div>
        <button onclick="goBackToList('series')"class="btn">Back</button>
      `;
      document.getElementById('seriesList').innerHTML = '';
      container.style.display = 'block';
      saveState('series', 'series', i); // Save active section, detail type, and index
      window.scrollTo(0, 0); // Scroll to top of details

      // --- ADDED LOGIC: Hide navigation and search bar ---
      document.querySelector('nav').style.display = 'none';
      document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'none');
      // --- END ADDED LOGIC ---
    }

    // Modified showMovieDetails to save the movie index
    function showMovieDetails(i) {
      const m = content.movies[i];
      const container = document.getElementById('movieDetails');
      container.innerHTML = `
        <img src="${m.image}" alt="${m.title}" />
        <h2>${m.title}</h2>
        <p>${m.description}</p>
        <div class="episode-buttons">
          <button onclick="playEpisode('${m.link}')">Watch Now</button>
        </div>
        <button onclick="goBackToList('movies')"class="btn">Back</button>
      `;
      document.getElementById('movieList').innerHTML = '';
      container.style.display = 'block';
      saveState('movies', 'movie', i); // Save active section, detail type, and index
      window.scrollTo(0, 0); // Scroll to top of details

      // --- ADDED LOGIC: Hide navigation and search bar ---
      document.querySelector('nav').style.display = 'none';
      document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'none');
      // --- END ADDED LOGIC ---
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

      // --- ADDED LOGIC: Show navigation and search bar ---
      document.querySelector('nav').style.display = 'flex'; // Revert to original display for nav
      document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'block'); // Revert to original display for search-box
      // --- END ADDED LOGIC ---
    }

    // Original playEpisode and closeFullScreen remain the same
    function playEpisode(link) {
      const player = document.getElementById('videoFullScreen');
      player.querySelector('iframe').src = link;
      player.style.display = 'flex';
      // No need to save state here, as the video player is an overlay
    }

    function closeFullScreen() {
      const player = document.getElementById('videoFullScreen');
      player.querySelector('iframe').src = '';
      player.style.display = 'none';
      // Restore scroll position after closing video player
      restoreScrollPosition();
    }

    // --- NEW/MODIFIED FUNCTION: Add to Watch Later ---
    function addToWatchLater(itemIndex, itemType) {
        let watchLaterItems = JSON.parse(localStorage.getItem('watchLater')) || [];

        // Determine the correct content array based on itemType
        const itemContent = itemType === 'series' ? content.series : content.movies;
        const item = itemContent[itemIndex];

        if (!item) {
            console.error(`Item not found for type: ${itemType}, index: ${itemIndex}`);
            alert('Could not add item to Watch Later. Item not found.');
            return;
        }

        // Create an object to store item details
        const itemToAdd = {
            index: itemIndex,
            type: itemType,
            title: item.title,
            image: item.image
        };

        // Check if the item is already in the watch later list to avoid duplicates
        const isDuplicate = watchLaterItems.some(existingItem =>
            existingItem.index === itemToAdd.index && existingItem.type === itemToAdd.type
        );

        if (!isDuplicate) {
            watchLaterItems.push(itemToAdd);
            localStorage.setItem('watchLater', JSON.stringify(watchLaterItems));
            alert(`${itemToAdd.title} added to Watch Later!`); // Simple feedback
            console.log('Watch Later items:', watchLaterItems);
        } else {
            alert(`${itemToAdd.title} is already in your Watch Later list.`);
        }
    }
    // --- END NEW/MODIFIED FUNCTION ---

    // --- NEW FUNCTION: Show Watch Later List ---
    function showWatchLaterList() {
        const container = document.getElementById('watchLaterList');
        const noItemsMessage = document.getElementById('noWatchLaterItems');
        container.innerHTML = ''; // Clear previous items

        let watchLaterItems = JSON.parse(localStorage.getItem('watchLater')) || [];

        if (watchLaterItems.length === 0) {
            noItemsMessage.style.display = 'block'; // Show "No items" message
        } else {
            noItemsMessage.style.display = 'none'; // Hide "No items" message
            watchLaterItems.forEach(item => {
                const div = document.createElement('div');
                div.className = 'series-item'; // Use existing styling
                div.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" />
                    <h4>${item.title}</h4>
                    <button onclick="${item.type === 'series' ? `showSeriesDetails(${item.index})` : `showMovieDetails(${item.index})`}" class="btn">View</button>
                    <button onclick="removeFromWatchLater(${item.index}, '${item.type}')" class="btn">Remove</button>
                `;
                container.appendChild(div);
            });
        }
        // Ensure nav and search are visible when in watchLater section
        document.querySelector('nav').style.display = 'flex';
        document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'block');
    }
    // --- END NEW FUNCTION ---

    // --- NEW FUNCTION: Remove from Watch Later ---
    function removeFromWatchLater(itemIndex, itemType) {
        let watchLaterItems = JSON.parse(localStorage.getItem('watchLater')) || [];
        const initialLength = watchLaterItems.length;

        // Filter out the item to be removed
        watchLaterItems = watchLaterItems.filter(item =>
            !(item.index === itemIndex && item.type === itemType)
        );

        if (watchLaterItems.length < initialLength) {
            localStorage.setItem('watchLater', JSON.stringify(watchLaterItems));
            alert('Item removed from Watch Later.');
            showWatchLaterList(); // Re-render the list after removal
        } else {
            console.warn('Attempted to remove item not found:', { index: itemIndex, type: itemType });
        }
    }
    // --- END NEW FUNCTION ---

    // --- Initialize on DOM Content Loaded ---
    document.addEventListener('DOMContentLoaded', function() {
        const lastActiveSection = localStorage.getItem('lastActiveSection');
        const lastDetailType = localStorage.getItem('lastDetailType');
        const lastDetailIndex = localStorage.getItem('lastDetailIndex');

        if (lastActiveSection) {
            // First, load all lists (so content exists if details are to be shown)
            showSeriesList();
            showMovieList();
            // Do NOT call showWatchLaterList here, it will be called by showSection if watchLater was last active

            // Then, activate the remembered section
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById(lastActiveSection).classList.add('active');

            // If a specific detail was being viewed, show it
            if (lastDetailType && lastDetailIndex !== null) {
                if (lastDetailType === 'series') {
                    showSeriesDetails(parseInt(lastDetailIndex, 10));
                } else if (lastDetailType === 'movie') {
                    showMovieDetails(parseInt(lastDetailIndex, 10));
                }
                // --- ADDED: Ensure nav/search are hidden if resuming into a detail view ---
                document.querySelector('nav').style.display = 'none';
                document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'none');
                // --- END ADDED ---
            } else {
                // If only a section was remembered (not a specific detail view),
                // ensure the detail display is hidden and restore general scroll.
                if (lastActiveSection === 'series') {
                    document.getElementById('seriesDetails').style.display = 'none';
                } else if (lastActiveSection === 'movies') {
                    document.getElementById('movieDetails').style.display = 'none';
                } else if (lastActiveSection === 'watchLater') { // ADDED: If resuming to watchLater, show it
                    showWatchLaterList();
                }
                // --- ADDED: Ensure nav/search are visible if resuming into a list view ---
                document.querySelector('nav').style.display = 'flex';
                document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'block');
                // --- END ADDED ---
            }
            restoreScrollPosition(); // Restore scroll position after everything else is set up
        } else {
            // If no state is remembered, default to 'home' and show lists
            showSection('home');
            showSeriesList();
            showMovieList();
            // --- ADDED: Ensure nav/search are visible on first load ---
            document.querySelector('nav').style.display = 'flex';
            document.querySelectorAll('.search-box').forEach(sb => sb.style.display = 'block');
            // --- END ADDED ---
        }

        // Add a global scroll listener to save position periodically
        // This handles general scrolling within a section (e.g., long lists)
        let scrollTimer;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                saveScrollPosition();
            }, 200); // Save scroll position after 200ms of no scrolling
        });

        // Save scroll position before the user leaves the page
        window.addEventListener('beforeunload', saveScrollPosition);
    });

    // --- End of New/Modified JavaScript ---
