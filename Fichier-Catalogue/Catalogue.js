const API_KEY = '3c0e7e42';
const BASE_URL = 'https://www.omdbapi.com/';

async function fetchMovies(searchTerm, targetContainerId) {
    const container = document.getElementById(targetContainerId);
    if (!container) return;

    container.innerHTML = '<div class="loader">Chargement des films...</div>';

    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();

        if (data.Response === "True") {
            displayMovies(data.Search, container);
        } else {
            container.innerHTML = `<div class="loader">Aucun film trouvé pour "${searchTerm}".</div>`;
        }
    } catch (error) {
        console.error("Erreur API :", error);
        container.innerHTML = `<div class="loader">Erreur lors de la connexion à l'API.</div>`;
    }
}

function displayMovies(movies, container) {
    container.innerHTML = '';
    movies.forEach(movie => {
        const posterUrl = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=Pas+d'affiche";
       
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
            <img src="${posterUrl}" alt="${movie.Title}" class="movie-poster">
            <div class="movie-info">
                <div class="movie-title">${movie.Title}</div>
                <div class="movie-footer">
                    <span>${movie.Year}</span>
                    <span class="movie-type">Film</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Fonction appelée par les boutons de catégories du HTML
function fetchCategory(categoryName) {
    fetchMovies(categoryName, 'categoryMoviesGrid');
}

// Chargement par défaut d'une catégorie au démarrage de la page
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies('Action', 'categoryMoviesGrid');
});
export const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=3c0e7e42';
