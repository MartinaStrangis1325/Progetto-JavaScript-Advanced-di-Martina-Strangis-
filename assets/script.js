// costanti per la chiamata alle API
const BASE_URL = 'https://openlibrary.org/subjects/';
const FORMAT = '.json';

// elementi del DOM
const searchBox = document.getElementById('search-box');
const searchButton = document.getElementById('search-button');
const bookList = document.getElementById('book-list');
const bookDescription = document.getElementById('book-description');

// funzione per ottenere l'elenco dei libri
function getBookList(category) {
  const url = BASE_URL + category + FORMAT;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // svuota l'elenco dei libri
      bookList.innerHTML = '';

      // controlla se ci sono risultati
      if (data.work_count === 0) {
        bookList.textContent = `Non sono stati trovati risultati per la categoria "${category}". Prova con un'altra categoria.`;
        return;
      }

      // cicla sui risultati e visualizza il titolo e gli autori dei libri
      data.works.forEach(work => {
        const title = work.title;
        const authors = work.authors.map(author => author.name).join(', ');
        const li = document.createElement('li');
        li.textContent = `${title} - ${authors}`;
        li.addEventListener('click', () => getBookDescription(work.key));
        bookList.appendChild(li);
      });
    })
    .catch(error => console.log(error));
}

// funzione per ottenere la descrizione di un libro
function getBookDescription(key) {
  const url = 'https://openlibrary.org' + key + FORMAT;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // visualizza la descrizione del libro
      let description;
      if (data.description && typeof data.description === 'object') {
        description = data.description.value || 'Descrizione non disponibile.';
      } else {
        description = data.description || 'Descrizione non disponibile.';
      }
      bookDescription.textContent = description;
    })
    .catch(error => console.log(error));
}

// gestore dell'evento di click del pulsante di ricerca
searchButton.addEventListener('click', () => {
  const category = searchBox.value.trim();
  getBookList(category);
});

// gestore dell'evento di pressione del tasto Enter nella casella di ricerca
searchBox.addEventListener('keypress', event => {
  if (event.key === 'Enter') {
    const category = searchBox.value.trim();
    getBookList(category);
  }
});







