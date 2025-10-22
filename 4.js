// Home Section Data - YOU MANUALLY ADD ITEMS HERE
const homeData = {
    // MANUALLY ADD LATEST MOVIES (use movie indices from your movies array)
    latestMovies: [0, 1, 2], // Example: first 3 movies
    
    // MANUALLY ADD LATEST SERIES (use series indices from your series array)
    latestSeries: [0, 1, 2], // Example: first 3 series
    
    // MANUALLY ADD FEATURED CONTENT (mix of movies and series)
    featured: [
        { type: 'movie', index: 0 }, // First movie
        { type: 'series', index: 0 }, // First series
        { type: 'movie', index: 1 }, // Second movie
        { type: 'series', index: 1 } // Second series
    ],
    
    // MANUALLY ADD UPCOMING CONTENT
    upcoming: [
        { type: 'movie', index: 3, title: "Upcoming Movie 1", image: "upcoming1.jpg", description: "Coming soon..." },
        { type: 'series', index: 3, title: "Upcoming Series 1", image: "upcoming2.jpg", description: "Coming soon..." },
        { type: 'movie', index: 4, title: "Upcoming Movie 2", image: "upcoming3.jpg", description: "Coming soon..." }
    ],
    
    // MANUALLY ADD RECOMMENDATIONS
    recommendations: [
        { type: 'movie', index: 2, reason: "Fan Favorite" },
        { type: 'series', index: 2, reason: "Trending Now" },
        { type: 'movie', index: 5, reason: "Highly Rated" },
        { type: 'series', index: 4, reason: "Editor's Pick" }
    ]
};

// Home Section Logic
function initializeHomeSection() {
    console.log("Initializing home section...");
    updateHomeContent();
    setupHomeScrollTracking();
}

function setupHomeScrollTracking() {
    const homeSection = document.getElementById('home');
    if (!homeSection) return;
    
    homeSection.addEventListener('scroll', () => {
        if (homeSection.classList.contains('active')) {
            saveScrollPosition('home');
        }
    });
}

function updateHomeContent() {
    updateLatestMovies();
    updateLatestSeries();
    updateFeaturedContent();
    updateUpcomingContent();
    updateRecommendations();
}

// Update latest movies section (MANUALLY CONTROLLED)
function updateLatestMovies() {
    const container = document.getElementById('latestMovies');
    container.innerHTML = '';
    
    if (homeData.latestMovies.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; color: #666; text-align: center;">No latest movies added yet.</p>';
        return;
    }
    
    homeData.latestMovies.forEach((movieIndex) => {
        const movie = content.movies[movieIndex];
        if (movie) {
            const movieElement = createHomeItem(movie, 'movie', movieIndex);
            container.appendChild(movieElement);
        }
    });
}

// Update latest series section (MANUALLY CONTROLLED)
function updateLatestSeries() {
    const container = document.getElementById('latestSeries');
    container.innerHTML = '';
    
    if (homeData.latestSeries.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; color: #666; text-align: center;">No latest series added yet.</p>';
        return;
    }
    
    homeData.latestSeries.forEach((seriesIndex) => {
        const series = content.series[seriesIndex];
        if (series) {
            const seriesElement = createHomeItem(series, 'series', seriesIndex);
            container.appendChild(seriesElement);
        }
    });
}

// Update featured content section (MANUALLY CONTROLLED)
function updateFeaturedContent() {
    const container = document.getElementById('featuredContent');
    container.innerHTML = '';
    
    if (homeData.featured.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; color: #666; text-align: center;">No featured content added yet.</p>';
        return;
    }
    
    homeData.featured.forEach((item) => {
        const contentItem = item.type === 'movie' ? content.movies[item.index] : content.series[item.index];
        if (contentItem) {
            const itemElement = createHomeItem(contentItem, item.type, item.index, true);
            container.appendChild(itemElement);
        }
    });
}

// Update upcoming content section (MANUALLY CONTROLLED - can use existing or new items)
function updateUpcomingContent() {
    const container = document.getElementById('upcomingContent');
    container.innerHTML = '';
    
    if (homeData.upcoming.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; color: #666; text-align: center;">No upcoming content added yet.</p>';
        return;
    }
    
    homeData.upcoming.forEach((item) => {
        // If it's an existing item, get from content arrays
        let contentItem, itemType, itemIndex;
        
        if (item.type && item.index !== undefined) {
            // Existing item from movies/series arrays
            contentItem = item.type === 'movie' ? content.movies[item.index] : content.series[item.index];
            itemType = item.type;
            itemIndex = item.index;
        } else {
            // Custom upcoming item (not in main arrays yet)
            contentItem = item;
            itemType = item.type || 'movie';
            itemIndex = item.index || 0;
        }
        
        if (contentItem) {
            const itemElement = createUpcomingItem(contentItem, itemType, itemIndex);
            container.appendChild(itemElement);
        }
    });
}

// Update recommendations section (MANUALLY CONTROLLED)
function updateRecommendations() {
    const container = document.getElementById('recommendations');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (homeData.recommendations.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; color: #666; text-align: center;">No recommendations added yet.</p>';
        return;
    }
    
    homeData.recommendations.forEach((item) => {
        const contentItem = item.type === 'movie' ? content.movies[item.index] : content.series[item.index];
        if (contentItem) {
            const itemElement = createHomeItem(contentItem, item.type, item.index, false, item.reason);
            container.appendChild(itemElement);
        }
    });
}

// Create regular home item element
function createHomeItem(item, type, originalIndex, isFeatured = false, recommendationReason = '') {
    const div = document.createElement('div');
    div.className = 'home-item';
    
    const featuredBadge = isFeatured ? '<span class="featured-badge">Featured</span>' : '';
    const recommendationBadge = recommendationReason ? `<span class="recommendation-badge">${recommendationReason}</span>` : '';
    
    div.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        ${featuredBadge}
        ${recommendationBadge}
        <div class="home-item-content">
            <h4>${item.title}</h4>
            <p>${item.description ? item.description.substring(0, 60) + '...' : 'No description available'}</p>
            <button onclick="navigateFromHome('${type}', ${originalIndex})" class="btn">View Details</button>
            <button onclick="addToWatchLater('${type}', ${originalIndex})" class="watch-later-btn">Watch Later</button>
        </div>
    `;
    
    return div;
}

// Create upcoming item element (special styling)
function createUpcomingItem(item, type, originalIndex) {
    const div = document.createElement('div');
    div.className = 'home-item upcoming-item';
    
    div.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <span class="upcoming-badge">Coming Soon</span>
        <div class="home-item-content">
            <h4>${item.title}</h4>
            <p>${item.description ? item.description.substring(0, 60) + '...' : 'No description available'}</p>
            <div class="upcoming-actions">
                <button onclick="addToWatchLater('${type}', ${originalIndex})" class="watch-later-btn">Notify Me</button>
            </div>
        </div>
    `;
    
    return div;
}

// Navigate to item details from home section
function navigateFromHome(type, index) {
    saveScrollPosition('home');
    localStorage.setItem('originSection', 'home');
    
    if (type === 'series') {
        showSeriesDetails(index, 'home');
    } else {
        showMovieDetails(index, 'home');
    }
}

// Listen for content updates
document.addEventListener('contentUpdated', function() {
    if (document.getElementById('home').classList.contains('active')) {
        updateHomeContent();
    }
});