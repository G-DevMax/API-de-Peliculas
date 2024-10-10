const apiKey = "5c5fac48752beb77f6ba00ca9613d815"; // Reemplaza con tu clave API
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('movie-details');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
let selectedMovieId = null;
let selectedMovieTitle = ""
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

// Fetch and display popular movies
async function fetchPopularMovies() {
    try {
        // tu codigo aqui: realiza una solicitud para obtener las películas populares
        const response = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}&language`)
        const data = await response.json();
        const popularMovies = data.results;
        // y llama a displayMovies con los resultados
        displayMovies(popularMovies);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

// Display movies
function displayMovies(movies) { // carga el argumento movies (que es "popularMovies" por la funcion anterior) donde se buscara la lista de peliculas
    movieList.innerHTML = ''; // Limpia la lista de películas
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
        `; // aqui se carga la imagen con la pelicula y su titulo
        li.onclick = () => showMovieDetails(movie.id); // Muestra detalles al hacer clic en la película
        movieList.appendChild(li);
        selectedMovieId = movie.id
    });
}

// Show movie details
async function showMovieDetails(movieId) {
    selectedMovieId = movieId
    try {
        // tu codigo aqui: realiza una solicitud para obtener los detalles de la película
        const response = await fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}`) // declaro la variable donde se guarda la busqueda de los detalles de la pelicula
        const data = await response.json() // declaro la constante donde se guarda los datos de la busqueda 
        const movieDetailsData = data // declaro la constante donde se guardara los datos con los detalles de la pelicla, para utilizarlos despues
        // y actualiza el contenedor de detalles con la información de la película
        const h3 = document.createElement("h3")
        h3.textContent = movieDetailsData.title
        const img = document.createElement("img")
        img.src = `https://image.tmdb.org/t/p/w500${movieDetailsData.poster_path} alt="${movieDetailsData.title}"`
        const p = document.createElement("p")
        p.textContent = movieDetailsData.overview
        const fecha = document.createElement("p")
        fecha.textContent = movieDetailsData.release_date

        detailsContainer.innerHTML = ""
        detailsContainer.appendChild(h3)
        h3.setAttribute = ("id", "details")
        detailsContainer.appendChild(img)
        detailsContainer.appendChild(p)
        detailsContainer.appendChild(fecha)

        movieDetails.style.display = "block";
        selectedMovieTitle = movieDetailsData.title

    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Search movies
searchButton.addEventListener('click', async () => {
    const query = searchInput.value; // se declara la constante "consulta" que guarda el valor ingresado de busqueda
    if (query) { // si query no esta vacio (tiene un valor)
        try {
            // tu codigo aqui: realiza una solicitud para buscar películas
            const response = await fetch(`${apiUrl}/search/movie?query=${query}&api_key=${apiKey}`)
            const data = await response.json()
            const movieSearch = data.results;
            // y llama a displayMovies con los resultados de la búsqueda
            displayMovies(movieSearch)
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    }
});

// Add movie to favorites
addToFavoritesButton.addEventListener('click', () => { 
    if (selectedMovieId) {
        const favoriteMovie = {
            id: selectedMovieId,
            title: selectedMovieTitle

        };
        if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {
            favoriteMovies.push(favoriteMovie);
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); // Guarda en localStorage
            displayFavorites(); // Muestra la lista actualizada de favoritos
            console.log(favoriteMovie)
        }
    }
});

// Display favorite movies
function displayFavorites() {
    favoritesList.innerHTML = ''; // Limpia la lista de favoritos
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        favoritesList.appendChild(li);
    });
}

// Initial fetch of popular movies and display favorites
fetchPopularMovies(); // Obtiene y muestra las películas populares
displayFavorites(); // Muestra las películas favoritas guardadas