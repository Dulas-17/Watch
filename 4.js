// Home Section Logic
// This file handles the home section functionality

// Track recently added items with timestamps
function initializeRecentlyAddedTracking() {
    // Initialize if not exists
    if (!localStorage.getItem('recentlyAdded')) {
        localStorage.setItem('recentlyAdded', JSON.stringify({
            movies: [],
            series: []
        }));
    }
}

// Add item to recently added when it's first loaded
function trackNewItem(type, index) {
    const item = type === 'series' ? content.series[index] : content.movies[index];
    const recentlyAdded = JSON.parse(localStorage.getItem('recentlyAdded') || '{"movies":[],"series":[]}');
    
    const itemId = `${type}-${index}`;
    const timestamp = new Date().toISOString();
    
    // Remove if already exists
    recentlyAdded[type] = recentlyAdded[type].filter(item => item.id !== itemId);
    
    // Add to beginning (most recent first)
    recentlyAdded[type].unshift({
        id: itemId,
        type: type,
        index: index,
        timestamp: timestamp,
        title: item.title
    });
    
    // Keep only last 10 items per type
    recentlyAdded[type] = recentlyAdded[type].slice(0, 10);
    
    localStorage.setItem('recentlyAdded', JSON.stringify(recentlyAdded));
}

// Initialize home section
function initializeHomeSection() {
    console.log("Initializing home section...");
    initializeRecentlyAddedTracking();
    updateHomeContent();
    
    // Add scroll tracking for home section
    setupHomeScrollTracking();
}

// Setup scroll tracking for home section
function setupHomeScrollTracking() {
    const homeSection = document.getElementById('home');
    if (!homeSection) return;
    
    // Save scroll position when home section is active and user scrolls
    homeSection.addEventListener('scroll', () => {
        if (homeSection.classList.contains('active')) {
            saveScrollPosition('home');
        }
    });
}

// Update home section with latest content
function updateHomeContent() {
    updateLatestMovies();
    updateLatestSeries();
    updateFeaturedContent();
    updateRecentlyAdded();
    updateRecommendations();
}

// Get latest movies (based on tracking, not array position)
function getLatestMovies() {
    const recentlyAdded = JSON.parse(localStorage.getItem('recentlyAdded') || '{"movies":[],"series":[]}');
    const recentMovies = recentlyAdded.movies.slice(0, 6); // Get 6 most recent movies
    
    return recentMovies.map(entry => {
        const movie = content.movies[entry.index];
        return {
            ...movie,
            trackedIndex: entry.index,
            addedDate: entry.timestamp
        };
    }).filter(movie => movie !== undefined); // Filter out undefined entries
}

// Get latest series (based on tracking, not array position)
function getLatestSeries() {
    const recentlyAdded = JSON.parse(localStorage.getItem('recentlyAdded') || '{"movies":[],"series":[]}');
    const recentSeries = recentlyAdded.series.slice(0, 6); // Get 6 most recent series
    
    return recentSeries.map(entry => {
        const series = content.series[entry.index];
        return {
            ...series,
            trackedIndex: entry.index,
            addedDate: entry.timestamp
        };
    }).filter(series => series !== undefined); // Filter out undefined entries
}

// Get featured content (mix of popular movies and series)
function getFeaturedContent() {
    // You can manually set featured items here or use some criteria
    const featuredItems = [];
    
    // Example: First 2 movies and first 2 series as featured
    if (content.movies.length > 0) {
        featuredItems.push({
            ...content.movies[0],
            type: 'movie',
            trackedIndex: 0
        });
    }
    if (content.movies.length > 1) {
        featuredItems.push({
            ...content.movies[1],
            type: 'movie',
            trackedIndex: 1
        });
    }
    if (content.series.length > 0) {
        featuredItems.push({
            ...content.series[0],
            type: 'series',
            trackedIndex: 0
        });
    }
    if (content.series.length > 1) {
        featuredItems.push({
            ...content.series[1],
            type: 'series',
            trackedIndex: 1
        });
    }
    
    return featuredItems.slice(0, 6);
}

// Get recently added content (all recent items mixed)
function getRecentlyAdded() {
    const recentlyAdded = JSON.parse(localStorage.getItem('recentlyAdded') || '{"movies":[],"series":[]}');
    
    // Combine movies and series, sort by timestamp
    const allRecent = [
        ...recentlyAdded.movies.map(entry => ({...entry, itemType: 'movie'})),
        ...recentlyAdded.series.map(entry => ({...entry, itemType: 'series'}))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 8);
    
    return allRecent.map(entry => {
        const item = entry.itemType === 'series' ? content.series[entry.index] : content.movies[entry.index];
        return {
            ...item,
            type: entry.itemType,
            trackedIndex: entry.index,
            addedDate: entry.timestamp
        };
    }).filter(item => item !== undefined);
}

// Get recommendations (based on watch history or random popular items)
function getRecommendations() {
    const recommendations = [];
    
    // Get some random popular items (you can customize this logic)
    const popularMovies = content.movies.filter(movie => movie.rating > 4 || movie.featured);
    const popularSeries = content.series.filter(series => series.rating > 4 || series.featured);
    
    // Add 2 popular movies
    if (popularMovies.length > 0) {
        recommendations.push({
            ...popularMovies[0],
            type: 'movie',
            trackedIndex: content.movies.findIndex(m => m.title === popularMovies[0].title),
            reason: 'Highly Rated'
        });
    }
    if (popularMovies.length > 1) {
        recommendations.push({
            ...popularMovies[1],
            type: 'movie',
            trackedIndex: content.movies.findIndex(m => m.title === popularMovies[1].title),
            reason: 'Popular Choice'
        });
    }
    
    // Add 2 popular series
    if (popularSeries.length > 0) {
        recommendations.push({
            ...popularSeries[0],
            type: 'series',
            trackedIndex: content.series.findIndex(s => s.title === popularSeries[0].title),
            reason: 'Fan Favorite'
        });
    }
    if (popularSeries.length > 1) {
        recommendations.push({
            ...popularSeries[1],
            type: 'series',
            trackedIndex: content.series.findIndex(s => s.title === popularSeries[1].title),
            reason: 'Trending Now'
        });
    }
    
    return recommendations;
}

// Update latest movies section
function updateLatestMovies() {
    const container = document.getElementById('latestMovies');
    const latestMovies = getLatestMovies();
    
    container.innerHTML = '';
    
    if (latestMovies.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; color: #666; text-align: center;">No recent movies yet.</p>';
        return;
    }
    
    latestMovies.forEach((movie) => {
        const movieElement = createHomeItem(movie, 'movie', movie.trackedIndex);
        container.appendChild(movieElement);
    });
}

// Update latest series section
function updateLatestSeries() {
    const container = document.getElementById('latestSeries');
    const latestSeries = getLatestSeries();
    
    container.innerHTML = '';
    
    if (latestSeries.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; color: #666; text-align: center;">No recent series yet.</p>';
        return;
    }
    
    latestSeries.forEach((series) => {
        const seriesElement = createHomeItem(series, 'series', series.trackedIndex);
        container.appendChild(seriesElement);
    });
}

// Update featured content section
function updateFeaturedContent() {
    const container = document.getElementById('featuredContent');
    const featuredItems = getFeaturedContent();
    
    container.innerHTML = '';
    
    if (featuredItems.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; color: #666; text-align: center;">No featured content available.</p>';
        return;
    }
    
    featuredItems.forEach((item) => {
        const itemElement = createHomeItem(item, item.type || 'movie', item.trackedIndex, true);
        container.appendChild(itemElement);
    });
}

// Update recently added section
function updateRecentlyAdded() {
    const container = document.getElementById('recentlyAdded');
    const recentItems = getRecentlyAdded();
    
    container.innerHTML = '';
    
    if (recentItems.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; color: #666; text-align: center;">No recently added content.</p>';
        return;
    }
    
    recentItems.forEach((item) => {
        const itemElement = createHomeItem(item, item.type, item.trackedIndex);
        container.appendChild(itemElement);
    });
}

// Update recommendations section
function updateRecommendations() {
    const container = document.getElementById('recommendations');
    if (!container) return;
    
    const recommendations = getRecommendations();
    
    container.innerHTML = '';
    
    if (recommendations.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; color: #666; text-align: center;">No recommendations available.</p>';
        return;
    }
    
    recommendations.forEach((item) => {
        const itemElement = createHomeItem(item, item.type, item.trackedIndex, false, item.reason);
        container.appendChild(itemElement);
    });
}

// Create home item element
function createHomeItem(item, type, originalIndex, isFeatured = false, recommendationReason = '') {
    const div = document.createElement('div');
    div.className = 'home-item';
    
    // Add featured badge if needed
    const featuredBadge = isFeatured ? '<span class="featured-badge">Featured</span>' : '';
    
    // Add recommendation reason if provided
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

// Navigate to item details from home section
function navigateFromHome(type, index) {
    // Track this item as recently viewed
    trackNewItem(type, index);
    
    // Save current scroll position before navigating
    saveScrollPosition('home');
    
    // Save that we're coming from home section
    localStorage.setItem('originSection', 'home');
    
    if (type === 'series') {
        showSeriesDetails(index, 'home');
    } else {
        showMovieDetails(index, 'home');
    }
}

// Listen for content updates to refresh home section
document.addEventListener('contentUpdated', function() {
    if (document.getElementById('home').classList.contains('active')) {
        updateHomeContent();
    }
});

// Initialize tracking for all existing content when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Track all existing content as "recently added" on first load
    setTimeout(() => {
        content.movies.forEach((_, index) => trackNewItem('movie', index));
        content.series.forEach((_, index) => trackNewItem('series', index));
    }, 1000);
});

// Simulate content update event (you would call this when adding new content)
function triggerContentUpdate() {
    const event = new Event('contentUpdated');
    document.dispatchEvent(event);
}