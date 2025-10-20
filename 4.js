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