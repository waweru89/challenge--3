const BASE_URL = 'http://localhost:4000/films';
const loadFirstMovie = () => fetch(`${BASE_URL}/1`).then(res => res.json()).then(showMovieDetails);

const loadMovies = () => {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(movies => {
      const filmList = document.getElementById('films');
      filmList.innerHTML = '';  

      movies.forEach(movie => {
        const li = document.createElement('li');
        li.className = 'film item';
        li.innerHTML = `<span>${movie.title}</span> <button class="ui red button" style="margin-left: 10px;">Delete</button>`;
        
        li.querySelector('span').addEventListener('click', () => showMovieDetails(movie)); 
        li.querySelector('button').addEventListener('click', (e) => {
          e.stopPropagation();
          deleteMovie(movie.id, li);
        });

        filmList.appendChild(li);
      });
    });
};

const showMovieDetails = (movie) => {
  document.getElementById('poster').src = movie.poster;
  document.getElementById('title').textContent = movie.title;
  document.getElementById('runtime').textContent = `${movie.runtime} minutes`;
  document.getElementById('film-info').textContent = movie.description;
  document.getElementById('showtime').textContent = movie.showtime;

  const availableTickets = movie.capacity - movie.tickets_sold;
  const buyButton = document.getElementById('buy-ticket');
  document.getElementById('ticket-num').textContent = `${availableTickets} remaining tickets`;
  
  buyButton.textContent = availableTickets > 0 ? 'Buy Ticket' : 'Sold Out';
  buyButton.disabled = availableTickets === 0;

  buyButton.onclick = () => availableTickets > 0 && purchaseTicket(movie);
};

const purchaseTicket = (movie) => {
  fetch(`${BASE_URL}/${movie.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tickets_sold: movie.tickets_sold + 1 })
  })
  .then(res => res.json())
  .then(showMovieDetails);
};

const deleteMovie = (id, element) => {
  fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
    .then(res => res.ok && element.remove());
};

document.addEventListener('DOMContentLoaded', () => {
  loadFirstMovie();
  loadMovies();
});

