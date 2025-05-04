

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
        <button onclick="goBackToList()">Back to Series</button>
      `;
      document.getElementById('seriesList').innerHTML = '';
      container.style.display = 'block';
      document.querySelector('.search-box').style.display = 'none'; // hide search bar
    }

    function goBackToList() {
      document.getElementById('seriesDetails').style.display = 'none';
      showSeriesList();
      document.querySelector('.search-box').style.display = 'block'; // show search bar
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

    

    window.onload = () => {
      showSeriesList();
    };




  // Function to set a cookie
  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
  }

  // Function to get a cookie
  function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r
    }, '');
  }

  // Save scroll position to cookie when user scrolls
  window.addEventListener('scroll', function () {
    setCookie('scrollPosition', window.scrollY, 7); // expires in 7 days
  });

  // Restore scroll position from cookie when page loads
  window.addEventListener('load', function () {
    const savedPosition = getCookie('scrollPosition');
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition));
    }
  });
