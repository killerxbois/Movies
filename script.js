const API_URL = "https://sheetdb.io/api/v1/zq3lb2qxwe4on";
const videoPlayer = document.getElementById("videoPlayer");
const downloadBtn = document.getElementById("downloadBtn");
const themeToggle = document.getElementById("themeToggle");

document.addEventListener("DOMContentLoaded", () => {
    fetchMovies();
    fetchLiveStreams();
    loadTheme();
});

async function fetchMovies() {
    try {
        let response = await fetch(API_URL);
        let movies = await response.json();
        let container = document.getElementById("moviesContainer");
        container.innerHTML = "";

        movies.forEach(movie => {
            if (!movie.live) { // Exclude live streams
                let movieDiv = document.createElement("div");
                movieDiv.classList.add("movie");
                movieDiv.onclick = () => playMovie(movie.link, movie.title);

                movieDiv.innerHTML = `
                    <img src="${movie.poster}" alt="${movie.title}">
                    <h3>${movie.title}</h3>
                `;

                container.appendChild(movieDiv);
            }
        });

    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

async function fetchLiveStreams() {
    try {
        let response = await fetch(API_URL);
        let movies = await response.json();
        let container = document.getElementById("liveContainer");
        container.innerHTML = "";

        movies.forEach(movie => {
            if (movie.live) { // Only add live streams
                let liveDiv = document.createElement("div");
                liveDiv.classList.add("live");
                liveDiv.onclick = () => playLive(movie.link);

                liveDiv.innerHTML = `
                    <img src="${movie.poster}" alt="${movie.title}">
                    <h3>${movie.title}</h3>
                `;

                container.appendChild(liveDiv);
            }
        });

    } catch (error) {
        console.error("Error fetching live streams:", error);
    }
}

function playMovie(src, title) {
    videoPlayer.src = src;
    videoPlayer.load();
    document.getElementById("playerContainer").style.display = "flex";
    downloadBtn.href = src;

    // Resume playback from last saved time
    const lastTime = localStorage.getItem(`videoTime_${title}`) || 0;
    videoPlayer.currentTime = lastTime;
}

// Save playback time before closing
videoPlayer.addEventListener("timeupdate", () => {
    const videoTitle = document.querySelector(".movie h3")?.innerText;
    if (videoTitle) {
        localStorage.setItem(`videoTime_${videoTitle}`, videoPlayer.currentTime);
    }
});

function playLive(streamUrl) {
    if (Hls.isSupported()) {
        let hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(videoPlayer);
    } else {
        videoPlayer.src = streamUrl;
    }

    document.getElementById("playerContainer").style.display = "flex";
}

function closePlayer() {
    document.getElementById("playerContainer").style.display = "none";
    videoPlayer.pause();
}

// Theme Toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    updateThemeIcon();
});

function loadTheme() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
}

function searchMovies() {
    let input = document.getElementById("search").value.toLowerCase();
    let movies = document.getElementsByClassName("movie");

    for (let i = 0; i < movies.length; i++) {
        let title = movies[i].getElementsByTagName("h3")[0].innerText.toLowerCase();
        movies[i].style.display = title.includes(input) ? "block" : "none";
    }
}
