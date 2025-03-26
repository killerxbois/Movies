const API_URL = "https://sheetdb.io/api/v1/zq3lb2qxwe4on";

document.addEventListener("DOMContentLoaded", fetchMovies);

async function fetchMovies() {
    try {
        let response = await fetch(API_URL);
        let movies = await response.json();
        let container = document.getElementById("moviesContainer");
        container.innerHTML = "";

        movies.forEach(movie => {
            let movieDiv = document.createElement("div");
            movieDiv.classList.add("movie");
            movieDiv.onclick = () => playMovie(movie.link);

            movieDiv.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}">
                <h3>${movie.title}</h3>
            `;

            container.appendChild(movieDiv);
        });

    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

function playMovie(src) {
    document.getElementById("videoPlayer").src = src;
    document.getElementById("playerContainer").style.display = "flex";
}

function closePlayer() {
    document.getElementById("playerContainer").style.display = "none";
    document.getElementById("videoPlayer").pause();
}

function searchMovies() {
    let input = document.getElementById("search").value.toLowerCase();
    let movies = document.getElementsByClassName("movie");

    for (let i = 0; i < movies.length; i++) {
        let title = movies[i].getElementsByTagName("h3")[0].innerText.toLowerCase();
        movies[i].style.display = title.includes(input) ? "block" : "none";
    }
}