const ANILIST_URL = 'https://graphql.anilist.co';

const SEARCH_QUERY = `
query ($search: String) {
  Page(perPage: 20) {
    media(search: $search, type: ANIME) {
      id
      title {
        romaji
        english
      }
      startDate {
        year
      }
      format
      coverImage {
        large
        medium
      }
    }
  }
}
`;

async function fetchMovies(searchTerm, targetContainerId) {
    const container = document.getElementById(targetContainerId);
    if (!container) return;

    container.innerHTML = '<div class="loader">Chargement...</div>';

    try {
        const response = await fetch(ANILIST_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                query: SEARCH_QUERY,
                variables: { search: searchTerm }
            })
        });

        const data = await response.json();

        if (!response.ok || data.errors) {
            throw new Error(data.errors?.[0]?.message || `Erreur HTTP ${response.status}`);
        }

        const results = data.data?.Page?.media || [];
        if (results.length > 0) {
            displayMovies(results, container);
        } else {
            container.innerHTML = `<div class="loader">Aucun résultat pour "${searchTerm}".</div>`;
        }
    } catch (error) {
        console.error("Erreur API AniList :", error);
        container.innerHTML = `<div class="loader">Erreur : ${error.message}</div>`;
    }
}

function displayMovies(items, container) {
    container.innerHTML = '';
    items.forEach(item => {
        const posterUrl = item.coverImage?.large
            || item.coverImage?.medium
            || "https://via.placeholder.com/300x450?text=Pas+d'affiche";
        const title = item.title?.english || item.title?.romaji || 'Titre inconnu';
        const year = item.startDate?.year || 'N/A';

        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
            <img src="${posterUrl}" alt="${title}" class="movie-poster">
            <div class="movie-info">
                <div class="movie-title">${title}</div>
                <div class="movie-footer">
                    <span>${year}</span>
                    <span class="movie-type">${item.format || 'Anime'}</span>
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

    fetchMovies('Bleach', 'accueilMoviesGrid');
});