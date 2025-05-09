function showSection(id) {
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      document.getElementById(id).classList.add('active');
      if (id === 'series') {
        showSeriesList();
        document.getElementById('seriesDetails').style.display = 'none';
      } else if (id === 'movies') {
        showMovieList();
        document.getElementById('movieDetails').style.display = 'none';
      }
    }

    function searchContent(type) {
      const input = document.getElementById(type === 'series' ? 'seriesSearch' : 'movieSearch').value.toLowerCase();
      const filtered = content[type].filter(item => item.title.toLowerCase().includes(input));
      if (type === 'series') showSeriesList(filtered);
      else showMovieList(filtered);
    }

    function showSeriesList(list = content.series) {
      const container = document.getElementById('seriesList');
      container.innerHTML = '';
      list.forEach((s, i) => {
        const div = document.createElement('div');
        div.className = 'series-item';
        div.innerHTML = `
          <img src="${s.image}" alt="${s.title}" />
          <h4>${s.title}</h4>
          <button onclick="showSeriesDetails(${i})">Video List</button>
        `;
        container.appendChild(div);
      });
    }

    function showMovieList(list = content.movies) {
      const container = document.getElementById('movieList');
      container.innerHTML = '';
      list.forEach((m, i) => {
        const div = document.createElement('div');
        div.className = 'series-item';
        div.innerHTML = `
          <img src="${m.image}" alt="${m.title}" />
          <h4>${m.title}</h4>
          <button onclick="showMovieDetails(${i})">Watch</button>
        `;
        container.appendChild(div);
      });
    }

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
    }

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
    }

    function goBackToList(type) {
      if (type === 'series') {
        showSeriesList();
        document.getElementById('seriesDetails').style.display = 'none';
      } else {
        showMovieList();
        document.getElementById('movieDetails').style.display = 'none';
      }
    }





    function playEpisode(link) {
      const player = document.getElementById('videoFullScreen');
      player.querySelector('iframe').src = link;
      player.style.display = 'flex';
    }

    function closeFullScreen() {
      const player = document.getElementById('videoFullScreen');
      player.querySelector('iframe').src = '';
      player.style.display = 'none';
    }