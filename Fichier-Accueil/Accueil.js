const ITUNES_URL = 'https://itunes.apple.com/search';

async function fetchMovies(searchTerm, targetContainerId) {
    const container = document.getElementById(targetContainerId);
    if (!container) return;

    container.innerHTML = '<div class="loader">Chargement...</div>';

    try {
        const url = `${ITUNES_URL}?term=${encodeURIComponent(searchTerm)}&media=movie&limit=20`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            displayMovies(data.results, container);
        } else {
            container.innerHTML = `<div class="loader">Aucun résultat pour "${searchTerm}".</div>`;
        }
    } catch (error) {
        console.error("Erreur API iTunes :", error);
        container.innerHTML = `<div class="loader">Erreur : ${error.message}</div>`;
    }
}

function displayMovies(movies, container) {
    container.innerHTML = '';
    movies.forEach(movie => {
        const posterUrl = movie.artworkUrl100
            ? movie.artworkUrl100.replace('100x100bb', '600x600bb')
            : "https://via.placeholder.com/300x450?text=Pas+d'affiche";
        const title = movie.trackName || 'Titre inconnu';
        const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : 'N/A';

        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
            <img src="${posterUrl}" alt="${title}" class="movie-poster">
            <div class="movie-info">
                <div class="movie-title">${title}</div>
                <div class="movie-footer">
                    <span>${year}</span>
                    <span class="movie-type">Film</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

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

    fetchMovies('Batman', 'accueilMoviesGrid');
});