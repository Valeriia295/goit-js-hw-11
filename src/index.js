import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('form.search-form');
const gallery = document.querySelector('div.gallery');
const loadMoreBtn = document.querySelector('button.load-more');

loadMoreBtn.setAttribute('hidden', true);

// HTTP Request
async function picRequest(page = 1) {
  const API_KEY = '41222680-00250a1b413cf077b48553539';
  const BASE_URL = 'https://pixabay.com/api/?';
  const searchQuery = searchForm.elements.searchQuery.value;
  let response;
  try {
    response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: page,
        per_page: 40,
      },
    });
  } catch (error) {
    Notiflix.Notify.failure(`Error ${error}`);
    return response.data;
  }

  // Image card
  const markup = response.data.hits
    .map(
      hit =>
        `<div class="photo-card">
          <a class="image-link" href=${hit.largeImageURL} ><img class="image-preview" src=${hit.webformatURL} alt=${hit.tags} loading="lazy"/></a>
          <div class="info">
            <p class="info-item">
              <b>Likes </b>${hit.likes}
            </p>
            <p class="info-item">
              <b>Views </b>${hit.views}
            </p>
            <p class="info-item">
              <b>Comments </b>${hit.comments}
            </p>
            <p class="info-item">
              <b>Downloads </b>${hit.downloads}
            </p>
          </div>
        </div>`
    )
    .join('');
  // console.log(markup);
  loadMoreBtn.removeAttribute('hidden', true);

  // Messages
  const result = response.data.totalHits;
  if (result === 0) {
    loadMoreBtn.setAttribute('hidden', true);
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    Notiflix.Notify.success(`Hooray! We found ${result} images.`);
  }

  if (result !== 0 && page * 40 > result) {
    loadMoreBtn.setAttribute('hidden', true);
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  gallery.insertAdjacentHTML('beforeend', markup);

  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: '250',
  });

  lightbox.refresh();
}

searchForm.addEventListener('submit', event => {
  gallery.innerHTML = '';
  event.preventDefault();
  picRequest();
});

loadMoreBtn.addEventListener('click', event => {
  event.preventDefault();
  picRequest();
});
