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

      if (id === 'series') {
        showSeriesList();
        document.getElementById('seriesDetails').style.display = 'none';
      } else if (id === 'movies') {
        showMovieList();
        document.getElementById('movieDetails').style.display = 'none';
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
        div.innerHTML = `
          <img src="${s.image}" alt="${s.title}" />
          <h4>${s.title}</h4>
          <button onclick="showSeriesDetails(${i})">Video List</button>
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
        div.className = 'series-item';
        // Changed to use an anonymous function to pass 'i' directly to avoid immediate execution issues with loops
        div.innerHTML = `
          <img src="${m.image}" alt="${m.title}" />
          <h4>${m.title}</h4>
          <button onclick="showMovieDetails(${i})">Watch</button>
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
        <button onclick="goBackToList('series')">Back to Series</button>
      `;
      document.getElementById('seriesList').innerHTML = '';
      container.style.display = 'block';
      saveState('series', 'series', i); // Save active section, detail type, and index
      window.scrollTo(0, 0); // Scroll to top of details
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
        <button onclick="goBackToList('movies')">Back to Movies</button>
      `;
      document.getElementById('movieList').innerHTML = '';
      container.style.display = 'block';
      saveState('movies', 'movie', i); // Save active section, detail type, and index
      window.scrollTo(0, 0); // Scroll to top of details
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

    // --- Initialize on DOM Content Loaded ---
    document.addEventListener('DOMContentLoaded', function() {
        const lastActiveSection = localStorage.getItem('lastActiveSection');
        const lastDetailType = localStorage.getItem('lastDetailType');
        const lastDetailIndex = localStorage.getItem('lastDetailIndex');

        if (lastActiveSection) {
            // First, load all lists (so content exists if details are to be shown)
            showSeriesList();
            showMovieList();

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
            } else {
                // If only a section was remembered (not a specific detail view),
                // ensure the detail display is hidden and restore general scroll.
                if (lastActiveSection === 'series') {
                    document.getElementById('seriesDetails').style.display = 'none';
                } else if (lastActiveSection === 'movies') {
                    document.getElementById('movieDetails').style.display = 'none';
                }
            }
            restoreScrollPosition(); // Restore scroll position after everything else is set up
        } else {
            // If no state is remembered, default to 'home' and show lists
            showSection('home');
            showSeriesList();
            showMovieList();
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