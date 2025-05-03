

    function showSection(sectionId) {
      document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
      document.getElementById(sectionId).classList.add('active');
      if (sectionId === 'series') {
        showSeriesList();
        document.getElementById('seriesDetails').style.display = 'none';
      }
    }

    function searchContent() {
      const searchInput = document.getElementById('seriesSearch').value.toLowerCase();
      const filtered = content.series.filter(s => s.title.toLowerCase().includes(searchInput));
      showSeriesList(filtered);
    }

    function showSeriesList(list = content.series) {
      const container = document.getElementById('seriesList');
      container.innerHTML = '';
      list.forEach((s, index) => {
        const div = document.createElement('div');
        div.className = 'series-item';
        div.innerHTML = `
          <img src="${s.image}" alt="${s.title}" />
          <h4>${s.title}</h4>
          <button onclick="showSeriesDetails(${index})">Watch</button>
        `;
        container.appendChild(div);
      });
    }

    function showSeriesDetails(index) {
      const s = content.series[index];
      const container = document.getElementById('seriesDetails');
      container.innerHTML = `
        <img src="${s.image}" alt="${s.title}" />
        <h2>${s.title}</h2>
        <p>${s.description}</p>
        <div class="episode-buttons">
          ${s.episodes.map(ep => `<button onclick="playEpisode('${ep.link}')">${ep.title}</button>`).join('')}
        </div>
        <button onclick="goBackToList()">Back</button>
      `;
      document.getElementById('seriesList').innerHTML = '';
      container.style.display = 'block';
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

    function goBackToList() {
      document.getElementById('seriesDetails').style.display = 'none';
      showSeriesList();
    }

    window.onload = () => {
      showSeriesList();
    };