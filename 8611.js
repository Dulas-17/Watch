const content = {
      series: [
        {
          title: "Konosuba Season 1",
          image: "https://drive.google.com/file/d/12AKbRJ99P-j6yGMFmjCkC1WjVKwXJvTw/preview ",

          description: "An intergalactic adventure across unknown planets.",

          episodes: [
            { title: "Episode 1 ", link: " https://drive.google.com/file/d/110UyhRjYnSOomo3-9Wh30BZonjVHr7Nu/preview" },

            { title: "Episode 2 ", link: "https://drive.google.com/file/d/1128cXGsLQ_wUcjls8hcZbfy-YbeRwChc/preview " },

            { title: "Episode 3 ", link: "https://drive.google.com/file/d/110VFc93Wq49TvnsWq9AclCCsyt5scLSC/preview " },

            { title: "Episode 4 ", link: "https://drive.google.com/file/d/119B_PFF3wtTyQMu3pu4-rBpN1rrfI7dR/preview " },

            { title: "Episode 5  ", link: " https://drive.google.com/file/d/116FV6qv7Hjdpkj4v7deuoactP-ee-T9A/preview" },

            { title: "Episode 6  ", link: "https://drive.google.com/file/d/11A96GHkRYHQ1uwRwa4eMiVBxbqM5YcmA/preview " },

            { title: "Episode 7  ", link: "https://drive.google.com/file/d/11TiSpcFJr2N8r7GPyIGgmgy2tHfnQTtL/preview " },

            { title: "Episode 8 ", link: "https://drive.google.com/file/d/11tAEoUZsUeQa4ja3-Nnt76nOKR2_w5wa/preview " },

            { title: "Episode 9 ", link: "https://drive.google.com/file/d/11V8IleXjjcnlUAparkf44XBFEUwxK8Ou/preview " },

            { title: "Episode 10 ", link: " https://drive.google.com/file/d/11uRZmLQxY52jeIsQKiw6vf2d1jTiCBlr/preview" },

          ]
        },

        {
          title: "Your Name",
          image: " https://drive.google.com/file/d/12AKbRJ99P-j6yGMFmjCkC1WjVKwXJvTw/view?usp=drivesdk",

          description: "A detective unravels a conspiracy in a neon city.",

          episodes: [
            { title: "watch now", link:" https://drive.google.com/file/d/10e007gPw7-zykD4XnHU_v_HV3mS7Y72Y/preview" },

          ]
        }
      ]
    };

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
          <button onclick="showSeriesDetails(${index})">Video List</button>
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