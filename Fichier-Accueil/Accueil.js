const { BASE_URL } = require("../Fichier-Catalogue/Catalogue");

// Configuration de l'API OMDb
const API_KEY = '3c0e7e42';
// Fonction de requête API
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

// Affichage dynamique des cartes films
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

// Événements de recherche sur l'accueil
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) fetchMovies(query, 'accueilMoviesGrid');
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) fetchMovies(query, 'accueilMoviesGrid');
            }
        });
    }

    // Chargement par défaut sur l'accueil
    fetchMovies('Avengers', 'accueilMoviesGrid');
});